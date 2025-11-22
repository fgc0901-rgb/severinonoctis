import express from 'express';
import { getLiveStatus } from './liveWatcher.js';
import dotenv from 'dotenv';
dotenv.config();

export function startStatusServer() {
  const app = express();
  const port = process.env.STATUS_PORT || 3080;

  app.get('/status', (_req, res) => {
    const live = getLiveStatus();
    res.json({
      twitch_channel: process.env.TWITCH_CHANNEL,
      timestamp: new Date().toISOString(),
      live
    });
  });

  app.get('/', (_req, res) => {
    res.send('<h1>Severino Noctis Status</h1><p>Use <code>/status</code> para JSON.</p>');
  });

  app.listen(port, () => console.log(`[StatusServer] Rodando em http://localhost:${port}`));
  return app;
}
