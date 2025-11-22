import express from 'express';
import { getLiveStatus, getPlatformStatuses } from './liveWatcher.js';
import dotenv from 'dotenv';
dotenv.config();

export function startStatusServer() {
  const app = express();
  const port = process.env.STATUS_PORT || 3080;

  app.get('/status', (_req, res) => {
    const multi = getPlatformStatuses();
    res.json({
      timestamp: new Date().toISOString(),
      twitch_channel: process.env.TWITCH_CHANNEL,
      youtube_channel: process.env.YOUTUBE_CHANNEL_ID,
      kick_channel: process.env.KICK_CHANNEL_SLUG,
      platforms: multi
    });
  });

  app.get('/', (_req, res) => {
    res.send('<h1>Severino Noctis Multi-Status</h1><p>Use <code>/status</code> para JSON agregado (Twitch/YouTube/Kick).</p>');
  });

  app.listen(port, () => console.log(`[StatusServer] Rodando em http://localhost:${port}`));
  return app;
}
