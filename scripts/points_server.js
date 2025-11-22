#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'content_points.csv');
const PORT = process.env.POINTS_PORT || 4580;

function parseCsv(csv){
  const lines = csv.trim().split(/\r?\n/);
  const header = lines.shift().split(',');
  return lines.filter(l=>l.trim().length>0).map(line=>{
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
  // ISO week: Monday start
  const day = dateObj.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day; // Sunday -> -6
  const monday = new Date(dateObj);
  monday.setDate(dateObj.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: monday, end: sunday };
}

function aggregate(rows){
  const total = rows.reduce((s,r)=> s + r.points, 0);
  const byType = {};
  const byDate = {};
  let liveHours = 0, liveViews = 0, liveCount = 0;
  rows.forEach(r=>{
    byType[r.type] = (byType[r.type]||0) + r.points;
    byDate[r.date] = (byDate[r.date]||0) + r.points;
    if(r.type.toLowerCase()==='live'){
      liveHours += r.duration_hours;
      liveViews += r.views;
      liveCount += 1;
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

function serve(){
  http.createServer((req,res)=>{
    if(req.url === '/favicon.ico'){ res.writeHead(404); return res.end(); }
    let csv;
    try { csv = fs.readFileSync(CSV_PATH,'utf8'); } catch(e){
      res.writeHead(200,{ 'Content-Type':'application/json'});
      return res.end(JSON.stringify({error:'CSV not found', path: CSV_PATH}));
    }
    const rows = parseCsv(csv);
    const data = aggregate(rows);
    res.writeHead(200,{ 'Content-Type':'application/json'});
    res.end(JSON.stringify(data,null,2));
  }).listen(PORT, ()=>{
    console.log(`[points_server] Listening on http://localhost:${PORT}`);
  });
}

serve();
