'use strict';
const { runYtDlpWithRetry, verifyToken, setCors } = require('../_utils');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.query.token;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Missing token' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const { url, format } = payload;

  if (format === 'file') {
    return res.redirect(302, url);
  }

  try {
    const formatSelector =
      format === 'mp3'
        ? 'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio'
        : 'best[ext=mp4]/bestvideo[ext=mp4][height<=1080]+bestaudio[ext=m4a]/best';

    const output = await runYtDlpWithRetry([
      '--get-url',
      '--no-playlist',
      '--no-warnings',
      '--quiet',
      '-f', formatSelector,
      url,
    ]);

    const urls = output.split('\n').filter(Boolean);
    if (!urls.length) throw new Error('No URL returned by yt-dlp');

    return res.redirect(302, urls[0]);
  } catch (err) {
    console.error('stream/redirect error:', err.message);
    return res.status(500).json({ error: 'Download failed. Please try again.' });
  }
};
