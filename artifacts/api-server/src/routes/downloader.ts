import { Router } from "express";
import { spawn } from "child_process";
import crypto from "crypto";
import { GetMediaInfoBody, StartDownloadBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

const SECRET = process.env.SESSION_SECRET ?? "swiftload-secret-key";
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

const YTDLP_BASE_ARGS = [
  "--extractor-args", "youtube:player_client=ios",
  "--no-check-certificates",
  "--user-agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
];

function runYtDlp(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", [...YTDLP_BASE_ARGS, ...args]);
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

// ── POST /api/info ────────────────────────────────────────────────────────────

router.post("/info", async (req, res) => {
  const parsed = GetMediaInfoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { url } = parsed.data;
  const platform = detectPlatform(url);

  try {
    const jsonStr = await runYtDlp([
      "--dump-json",
      "--no-playlist",
      "--no-warnings",
      "--quiet",
      url,
    ]);

    const info = JSON.parse(jsonStr);

    const formats: { id: string; label: string; type: string; quality: string | null }[] = [
      { id: "mp4", label: "Video (MP4)", type: "mp4", quality: "best" },
      { id: "mp3", label: "Audio (MP3)", type: "mp3", quality: "best" },
    ];

    res.json({
      platform,
      title: info.title ?? "Unknown",
      thumbnail: info.thumbnail ?? null,
      duration: typeof info.duration === "number" ? info.duration : null,
      formats,
    });
  } catch (err) {
    // Fallback for direct file URLs or unsupported sites
    if (platform === "direct") {
      res.json({
        platform,
        title: url.split("/").pop() ?? "File",
        thumbnail: null,
        duration: null,
        formats: [
          { id: "file", label: "Original File", type: "file", quality: null },
        ],
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
    const title = await runYtDlp([
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

  // Build yt-dlp args for audio or video
  const args: string[] = ["--no-playlist", "--no-warnings", "-o", "-"];

  if (format === "mp3") {
    args.push("-f", "bestaudio", "--extract-audio", "--audio-format", "mp3");
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `attachment; filename="audio.mp3"`);
  } else {
    // mp4
    args.push("-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best");
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
  }

  args.push(url);

  req.log.info({ url, format }, "Starting yt-dlp stream");

  const proc = spawn("yt-dlp", [...YTDLP_BASE_ARGS, ...args]);

  proc.stdout.pipe(res);

  proc.stderr.on("data", (data: Buffer) => {
    req.log.debug({ stderr: data.toString() }, "yt-dlp stderr");
  });

  proc.on("error", (err) => {
    req.log.error({ err }, "yt-dlp process error");
    if (!res.headersSent) {
      res.status(500).json({ error: "Download process failed" });
    }
  });

  proc.on("close", (code) => {
    req.log.info({ code }, "yt-dlp finished");
    if (code !== 0 && !res.headersSent) {
      res.status(500).json({ error: "Download failed" });
    }
  });

  req.on("close", () => {
    proc.kill();
  });
});

export default router;
