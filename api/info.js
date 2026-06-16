'use strict';
const { detectPlatform, runYtDlp, setCors } = require('./_utils');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body || {};
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  const platform = detectPlatform(url);

  try {
    const jsonStr = await runYtDlp([
      '--dump-json',
      '--no-playlist',
      '--no-warnings',
      '--quiet',
      url,
    ]);

    const info = JSON.parse(jsonStr);

    return res.json({
      platform,
      title: info.title || 'Unknown',
      thumbnail: info.thumbnail || null,
      duration: typeof info.duration === 'number' ? info.duration : null,
      formats: [
        { id: 'mp4', label: 'Video (MP4)', type: 'mp4', quality: 'best' },
        { id: 'mp3', label: 'Audio (M4A)', type: 'mp3', quality: 'best' },
      ],
    });
  } catch (err) {
    if (platform === 'direct') {
      return res.json({
        platform,
        title: url.split('/').pop() || 'File',
        thumbnail: null,
        duration: null,
        formats: [{ id: 'file', label: 'Original File', type: 'file', quality: null }],
      });
    }
    console.error('yt-dlp info failed:', err.message);
    return res.status(500).json({
      error: 'Could not retrieve media info. Please check the URL and try again.',
    });
  }
};
