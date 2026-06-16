'use strict';
const { runYtDlp, signToken, setCors } = require('./_utils');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url, format } = req.body || {};
  if (!url || !format) {
    return res.status(400).json({ error: 'url and format are required' });
  }

  let filename = 'download';
  try {
    const title = await runYtDlp([
      '--get-title',
      '--no-playlist',
      '--no-warnings',
      '--quiet',
      url,
    ]);
    const safeTitle = title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_');
    const ext = format === 'mp3' ? 'm4a' : format === 'file' ? 'bin' : 'mp4';
    filename = `${safeTitle || 'download'}.${ext}`;
  } catch {
    const ext = format === 'mp3' ? 'm4a' : 'mp4';
    filename = `download.${ext}`;
  }

  const token = signToken({ url, format });
  return res.json({ token, filename });
};
