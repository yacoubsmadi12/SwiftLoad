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

const YTDLP_BASE_ARGS = [
  '--extractor-args', 'youtube:player_client=android,ios',
  '--no-check-certificates',
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

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_BIN, [...YTDLP_BASE_ARGS, ...args]);
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

module.exports = { YTDLP_BASE_ARGS, YTDLP_BIN, detectPlatform, runYtDlp, signToken, verifyToken, setCors };
