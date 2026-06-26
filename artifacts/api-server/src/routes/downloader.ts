import { Router } from "express";
import { spawn } from "child_process";
import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { GetMediaInfoBody, StartDownloadBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

const SECRET: string = (() => {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  const generated = crypto.randomBytes(32).toString("hex");
  logger.warn(
    "SESSION_SECRET is not set. A random secret was generated for this process. " +
    "Set SESSION_SECRET in production to prevent token invalidation on restart."
  );
  return generated;
})();
const TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ── helpers ──────────────────────────────────────────────────────────────────

function detectPlatform(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be"))
      return "youtube";
    if (hostname.includes("instagram.com")) return "instagram";
    if (hostname.includes("tiktok.com")) return "tiktok";
    if (hostname.includes("twitter.com") || hostname.includes("x.com"))
      return "twitter";
    if (hostname.includes("facebook.com") || hostname.includes("fb.com"))
      return "facebook";
  } catch {
    // invalid URL
  }
  return "direct";
}

function signToken(payload: object): string {
  const json = JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL_MS });
  const b64 = Buffer.from(json).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(b64)
    .digest("base64url");
  return `${b64}.${sig}`;
}

function verifyToken(token: string): { url: string; format: string } | null {
  try {
    const [b64, sig] = token.split(".");
    const expectedSig = crypto
      .createHmac("sha256", SECRET)
      .update(b64)
      .digest("base64url");
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    if (payload.exp < Date.now()) return null;
    return { url: payload.url, format: payload.format };
  } catch {
    return null;
  }
}

const YTDLP_COMMON_ARGS = [
  "--no-check-certificates",
  "--no-warnings",
  "--user-agent", "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36",
];

const YOUTUBE_CLIENT_SEQUENCES = [
  "mweb,tv_embedded,ios,android",
  "ios,mweb,android",
  "tv_embedded,mweb",
];

function runYtDlp(args: string[], youtubeClientOverride?: string): Promise<string> {
  const extraArgs = youtubeClientOverride
    ? ["--extractor-args", `youtube:player_client=${youtubeClientOverride}`]
    : ["--extractor-args", `youtube:player_client=${YOUTUBE_CLIENT_SEQUENCES[0]}`];

  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", [...YTDLP_COMMON_ARGS, ...extraArgs, ...args]);
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d: Buffer) => (stdout += d.toString()));
    proc.stderr.on("data", (d: Buffer) => (stderr += d.toString()));
    proc.on("close", (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(stderr.trim() || `yt-dlp exited with code ${code}`));
    });
  });
}

async function runYtDlpWithRetry(args: string[]): Promise<string> {
  let lastError: Error = new Error("unknown error");
  for (const clientSeq of YOUTUBE_CLIENT_SEQUENCES) {
    try {
      return await runYtDlp(args, clientSeq);
    } catch (err) {
      lastError = err as Error;
      const msg = lastError.message ?? "";
      if (!msg.includes("Sign in") && !msg.includes("bot") && !msg.includes("confirm")) {
        throw lastError;
      }
    }
  }
  throw lastError;
}

// ── POST /api/info ────────────────────────────────────────────────────────────

async function getYouTubeInfoViaOEmbed(url: string): Promise<{ title: string; thumbnail: string | null; duration: number | null }> {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const resp = await fetch(oembedUrl);
  if (!resp.ok) throw new Error(`oEmbed failed: ${resp.status}`);
  const data = await resp.json() as { title?: string; thumbnail_url?: string };
  return {
    title: data.title ?? "Unknown",
    thumbnail: data.thumbnail_url ?? null,
    duration: null,
  };
}

router.post("/info", async (req, res) => {
  const parsed = GetMediaInfoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { url } = parsed.data;
  const platform = detectPlatform(url);

  const formats = [
    { id: "mp4", label: "Video (MP4)", type: "mp4", quality: "best" },
    { id: "mp3", label: "Audio (MP3)", type: "mp3", quality: "best" },
  ];

  if (platform === "youtube") {
    try {
      const info = await getYouTubeInfoViaOEmbed(url);
      res.json({ platform, ...info, formats });
      return;
    } catch {
      // fall through to yt-dlp
    }
  }

  try {
    const jsonStr = await runYtDlpWithRetry([
      "--dump-json",
      "--no-playlist",
      "--no-warnings",
      "--quiet",
      url,
    ]);

    const info = JSON.parse(jsonStr);

    res.json({
      platform,
      title: info.title ?? "Unknown",
      thumbnail: info.thumbnail ?? null,
      duration: typeof info.duration === "number" ? info.duration : null,
      formats,
    });
  } catch (err) {
    if (platform === "direct") {
      res.json({
        platform,
        title: url.split("/").pop() ?? "File",
        thumbnail: null,
        duration: null,
        formats: [{ id: "file", label: "Original File", type: "file", quality: null }],
      });
      return;
    }
    req.log.error({ err }, "yt-dlp info failed");
    res.status(500).json({ error: "Could not retrieve media info. Please check the URL and try again." });
  }
});

// ── POST /api/download ────────────────────────────────────────────────────────

router.post("/download", async (req, res) => {
  const parsed = StartDownloadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { url, format } = parsed.data;

  let filename = "download";
  try {
    const title = await runYtDlpWithRetry([
      "--get-title",
      "--no-playlist",
      "--no-warnings",
      "--quiet",
      url,
    ]).catch(() => "download");
    const safeTitle = title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_");
    const ext = format === "mp3" ? "mp3" : format === "file" ? "bin" : "mp4";
    filename = `${safeTitle || "download"}.${ext}`;
  } catch {
    filename = `download.${format === "mp3" ? "mp3" : "mp4"}`;
  }

  const token = signToken({ url, format });
  res.json({ token, filename });
});

// ── GET /api/download/stream ──────────────────────────────────────────────────

router.get("/download/stream", async (req, res) => {
  const token = req.query.token;
  if (!token || typeof token !== "string") {
    res.status(400).json({ error: "Missing token" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const { url, format } = payload;

  // For direct file downloads, proxy the file
  if (format === "file") {
    // SSRF guard — block requests to private/localhost ranges
    try {
      const { hostname } = new URL(url);
      const isPrivate =
        /^localhost$/i.test(hostname) ||
        /^127\./.test(hostname) ||
        /^10\./.test(hostname) ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
        /^192\.168\./.test(hostname) ||
        /^::1$/.test(hostname) ||
        /^fd[0-9a-f]{2}:/i.test(hostname) ||
        /^169\.254\./.test(hostname);
      if (isPrivate) {
        res.status(400).json({ error: "Invalid URL" });
        return;
      }
    } catch {
      res.status(400).json({ error: "Invalid URL" });
      return;
    }
    try {
      const fetch = (await import("node-fetch")).default;
      const upstream = await fetch(url);
      if (!upstream.ok) {
        res.status(502).json({ error: "Could not fetch file" });
        return;
      }
      const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
      const filename = url.split("/").pop() ?? "download";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      if (upstream.body) {
        upstream.body.pipe(res);
      } else {
        res.status(502).json({ error: "Empty response from upstream" });
      }
    } catch (err) {
      req.log.error({ err }, "Direct file download failed");
      res.status(500).json({ error: "Download failed" });
    }
    return;
  }

  const isAudio = format === "mp3";
  const ext = isAudio ? "mp3" : "mp4";
  const tmpDir = os.tmpdir();
  const tmpBase = path.join(tmpDir, `swiftload-${crypto.randomUUID()}`);
  const tmpOut = `${tmpBase}.${ext}`;

  const args: string[] = [
    "--no-playlist",
    "--no-warnings",
    "--no-progress",
    "-o", tmpOut,
  ];

  if (isAudio) {
    args.push("-f", "bestaudio/best", "-x", "--audio-format", "mp3", "--audio-quality", "0");
  } else {
    args.push("-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best", "--merge-output-format", "mp4");
  }

  args.push(url);

  req.log.info({ url, format }, "Starting yt-dlp download to temp file");

  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

  function tryDownload(clientIndex: number): void {
    fs.unlink(tmpOut, () => {}); // clean up any partial file from previous attempt

    const ytArgs = isYouTube
      ? ["--extractor-args", `youtube:player_client=${YOUTUBE_CLIENT_SEQUENCES[clientIndex]}`]
      : [];

    const proc = spawn("yt-dlp", [...YTDLP_COMMON_ARGS, ...ytArgs, ...args]);

    let stderr = "";
    proc.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
      req.log.debug({ stderr: data.toString() }, "yt-dlp stderr");
    });

    proc.on("error", (err) => {
      req.log.error({ err }, "yt-dlp process error");
      fs.unlink(tmpOut, () => {});
      if (!res.headersSent) {
        res.status(500).json({ error: "Download process failed" });
      }
    });

    proc.on("close", (code) => {
      req.log.info({ code, clientIndex }, "yt-dlp attempt finished");

      if (code !== 0) {
        const isClientError = stderr.includes("not available on this app") ||
          stderr.includes("Sign in") ||
          stderr.includes("bot") ||
          stderr.includes("confirm");

        // Retry with next client if it's a YouTube bot/availability issue
        if (isYouTube && isClientError && clientIndex + 1 < YOUTUBE_CLIENT_SEQUENCES.length) {
          req.log.warn({ clientIndex, stderr }, "Retrying with next YouTube client");
          tryDownload(clientIndex + 1);
          return;
        }

        req.log.error({ stderr }, "yt-dlp failed all attempts");
        fs.unlink(tmpOut, () => {});
        if (!res.headersSent) {
          res.status(500).json({ error: "Download failed. The URL may be unsupported or unavailable." });
        }
        return;
      }

      const stat = fs.statSync(tmpOut, { throwIfNoEntry: false });
      if (!stat) {
        if (!res.headersSent) {
          res.status(500).json({ error: "Downloaded file not found" });
        }
        return;
      }

      res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");
      res.setHeader("Content-Disposition", `attachment; filename="download.${ext}"`);
      res.setHeader("Content-Length", stat.size);

      const readStream = fs.createReadStream(tmpOut);
      readStream.pipe(res);
      readStream.on("close", () => fs.unlink(tmpOut, () => {}));
      readStream.on("error", (err) => {
        req.log.error({ err }, "Stream error");
        fs.unlink(tmpOut, () => {});
      });
    });

    req.on("close", () => {
      proc.kill();
      fs.unlink(tmpOut, () => {});
    });
  }

  tryDownload(0);
});

export default router;
