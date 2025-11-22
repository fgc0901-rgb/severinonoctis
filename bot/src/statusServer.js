import express from 'express';
import { getPlatformStatuses } from './liveWatcher.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// ===== Points aggregation (migrated from standalone points_server.js) =====
const CSV_PATH = process.env.POINTS_CSV_PATH || path.join(process.cwd(), 'content_points.csv');

function parseCsv(csv){
  const lines = csv.trim().split(/\r?\n/);
  if(lines.length === 0) return [];
  const header = lines.shift().split(',');
  return lines.filter(l=>l.trim()).map(line=>{
    const cols = line.split(',');
    const obj = {};
    header.forEach((h,i)=> obj[h] = cols[i] || '');
    obj.points = Number(obj.points||0);
    obj.views = Number(obj.views||0);
    obj.duration_hours = Number(obj.duration_hours||0);
    return obj;
  });
}

function weekRange(dateObj){
  const day = dateObj.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(dateObj);
  monday.setDate(dateObj.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: monday, end: sunday };
}

function aggregate(rows){
  const total = rows.reduce((s,r)=> s + r.points, 0);
  const byType = {}; const byDate = {};
  let liveHours = 0, liveViews = 0, liveCount = 0;
  rows.forEach(r=>{
    byType[r.type] = (byType[r.type]||0) + r.points;
    byDate[r.date] = (byDate[r.date]||0) + r.points;
    if(r.type && r.type.toLowerCase() === 'live'){
      liveHours += r.duration_hours; liveViews += r.views; liveCount += 1;
    }
  });
  const today = new Date();
  const {start,end} = weekRange(today);
  const startStr = start.toISOString().slice(0,10);
  const endStr = end.toISOString().slice(0,10);
  const currentWeekPoints = rows.filter(r=> r.date >= startStr && r.date <= endStr)
    .reduce((s,r)=> s + r.points, 0);
  return {
    total_points: total,
    by_type: byType,
    by_date: byDate,
    current_week: { start: startStr, end: endStr, points: currentWeekPoints },
    lives: { count: liveCount, total_hours: liveHours, avg_duration: liveCount? (liveHours/liveCount):0, avg_views: liveCount? (liveViews/liveCount):0 }
  };
}

function getPointsData(){
  try {
    const csv = fs.readFileSync(CSV_PATH,'utf8');
    const rows = parseCsv(csv);
    return aggregate(rows);
  } catch(e){
    return { error:'CSV not found', path: CSV_PATH };
  }
}

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

  // Unified points endpoint
  app.get('/points', (_req,res) => {
    res.json(getPointsData());
  });
  app.get('/api/points', (_req,res) => res.json(getPointsData())); // alias

  app.get('/', (_req, res) => {
    res.send('<h1>Severino API</h1><p>Endpoints: <code>/status</code>, <code>/points</code>, <code>/api/points</code>.</p>');
  });

  app.listen(port, () => console.log(`[StatusServer] Rodando unificado em http://localhost:${port}`));
  return app;
}
