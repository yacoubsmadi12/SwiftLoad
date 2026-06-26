'use strict';
const { spawn } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SECRET = process.env.SESSION_SECRET || 'swiftload-secret-key';
const TOKEN_TTL_MS = 5 * 60 * 1000;

function getYtDlpBin() {
  if (process.env.YTDLP_BIN) return process.env.YTDLP_BIN;
  const candidates = [
    '/var/task/bin/yt-dlp',
    path.join(process.cwd(), 'bin', 'yt-dlp'),
    path.join(__dirname, '..', 'bin', 'yt-dlp'),
  ];
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return c; } catch {}
  }
  return 'yt-dlp';
}

const YTDLP_BIN = getYtDlpBin();

const YTDLP_COMMON_ARGS = [
  '--no-check-certificates',
  '--no-warnings',
  '--user-agent', 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
];

const YOUTUBE_CLIENT_SEQUENCES = [
  'mweb,tv_embedded,ios,android',
  'ios,mweb,android',
  'tv_embedded,mweb',
];

function detectPlatform(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
    if (hostname.includes('instagram.com')) return 'instagram';
    if (hostname.includes('tiktok.com')) return 'tiktok';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'facebook';
  } catch {}
  return 'direct';
}

function runYtDlp(args, youtubeClientOverride) {
  const clientSeq = youtubeClientOverride || YOUTUBE_CLIENT_SEQUENCES[0];
  const extraArgs = ['--extractor-args', `youtube:player_client=${clientSeq}`];
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_BIN, [...YTDLP_COMMON_ARGS, ...extraArgs, ...args]);
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', d => (stdout += d.toString()));
    proc.stderr.on('data', d => (stderr += d.toString()));
    proc.on('close', code => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(stderr.trim() || `yt-dlp exited with code ${code}`));
    });
    proc.on('error', reject);
  });
}

async function runYtDlpWithRetry(args) {
  let lastError = new Error('unknown error');
  for (const clientSeq of YOUTUBE_CLIENT_SEQUENCES) {
    try {
      return await runYtDlp(args, clientSeq);
    } catch (err) {
      lastError = err;
      const msg = err.message || '';
      if (!msg.includes('Sign in') && !msg.includes('bot') && !msg.includes('confirm')) {
        throw lastError;
      }
    }
  }
  throw lastError;
}

async function getYouTubeInfoViaOEmbed(url) {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const resp = await fetch(oembedUrl);
  if (!resp.ok) throw new Error(`oEmbed failed: ${resp.status}`);
  const data = await resp.json();
  return {
    title: data.title || 'Unknown',
    thumbnail: data.thumbnail_url || null,
    duration: null,
  };
}

function signToken(payload) {
  const json = JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL_MS });
  const b64 = Buffer.from(json).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

function verifyToken(token) {
  try {
    const [b64, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', SECRET).update(b64).digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) return null;
    return { url: payload.url, format: payload.format };
  } catch { return null; }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = {
  YTDLP_BIN, YTDLP_COMMON_ARGS,
  detectPlatform, runYtDlp, runYtDlpWithRetry,
  getYouTubeInfoViaOEmbed,
  signToken, verifyToken, setCors,
};
