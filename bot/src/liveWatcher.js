// Live watcher usando Twitch Helix
// Requer: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_CHANNEL, DISCORD_ANNOUNCE_CHANNEL_ID
// Fluxo: Obtém app token, faz polling em /streams?user_login=, detecta transição offline->live e anuncia.

// Estado Twitch
let lastLive = false;
let announcedThisSession = false;
let accessToken = null;
let tokenExpiry = 0;
let lastData = null;

// Estado YouTube
let ytLastLive = false;
let ytAnnounced = false;
let ytLastData = null;

// Estado Kick
let kickLastLive = false;
let kickAnnounced = false;
let kickLastData = null;

async function getAppToken({ clientId, clientSecret }) {
  if (!clientId || !clientSecret) {
    console.log('[LiveWatcher] Client ID/Secret ausentes, abortando.');
    return null;
  }
  const now = Date.now();
  if (accessToken && now < tokenExpiry) return accessToken;
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  });
  const res = await fetch('https://id.twitch.tv/oauth2/token', { method: 'POST', body: params });
  if (!res.ok) {
    console.log('[LiveWatcher] Falha ao obter token', res.status);
    return null;
  }
  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiry = now + (data.expires_in - 60) * 1000; // margem
  return accessToken;
}

async function checkLive({ clientId, clientSecret, channelLogin }) {
  try {
    const token = await getAppToken({ clientId, clientSecret });
    if (!token) return { live: false };
    const url = `https://api.twitch.tv/helix/streams?user_login=${channelLogin}`;
    const res = await fetch(url, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      console.log('[LiveWatcher] Helix erro', res.status);
      return { live: false };
    }
    const json = await res.json();
    const live = json.data && json.data.length > 0;
    return { live, data: json.data[0] };
  } catch (e) {
    console.log('[LiveWatcher] Erro checkLive', e.message);
    return { live: false };
  }
}

async function checkYouTubeLive({ apiKey, channelId }) {
  if (!apiKey || !channelId) return { live:false };
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return { live:false };
    const json = await res.json();
    const live = json.items && json.items.length > 0;
    return { live, data: live ? json.items[0] : null };
  } catch(e){
    console.log('[LiveWatcher][YouTube] Erro', e.message);
    return { live:false };
  }
}

async function checkKickLive({ slug }) {
  if (!slug) return { live:false };
  try {
    const url = `https://kick.com/api/v2/channels/${slug}`;
    const res = await fetch(url);
    if (!res.ok) return { live:false };
    const json = await res.json();
    const live = !!json.livestream;
    return { live, data: json.livestream };
  } catch(e){
    console.log('[LiveWatcher][Kick] Erro', e.message);
    return { live:false };
  }
}

function buildDiscordMessage(streamData, channelLogin) {
  const url = `https://twitch.tv/${channelLogin}`;
  if (!streamData) {
    return `🔴 **Ao vivo**: ${url}`;
  }
  const { title, game_name, viewer_count } = streamData;
  return {
    content: '🔴 **Severino Noctis Ao Vivo**',
    embeds: [
      {
        title: title || 'Transmissão ativa',
        url,
        description: `Jogo: **${game_name || 'Desconhecido'}**\nViewers: **${viewer_count || 0}**\nEntre e testemunhe os ecos.`,
        color: 0xb22222,
        footer: { text: 'Watcher Helix • Atualização inicial' }
      }
    ]
  };
}

export function startLiveWatcher(opts) {
  const { discordClient, channelLogin, announceChannelId, clientId, clientSecret, pollInterval, announceOnce } = opts;
  if (!discordClient) return console.log('[LiveWatcher] Discord não disponível.');
  if (!channelLogin || !announceChannelId) return console.log('[LiveWatcher] Configuração incompleta para watcher.');

  console.log(`[LiveWatcher] Iniciado: canal=${channelLogin}, intervalo=${pollInterval}ms`);

  async function poll() {
    const { live, data } = await checkLive({ clientId, clientSecret, channelLogin });
    if (live && !lastLive) {
      if (!announceOnce || (announceOnce && !announcedThisSession)) {
        const channel = discordClient.channels.cache.get(announceChannelId);
        if (channel) {
          const msgPayload = buildDiscordMessage(data, channelLogin);
          channel.send(msgPayload).catch(e => console.log('[LiveWatcher] Falha enviar anúncio', e.message));
          announcedThisSession = true;
        } else {
          console.log('[LiveWatcher] Canal Discord não encontrado.');
        }
      }
    }
    lastLive = live;
    lastData = live ? data : null;
  }

  poll(); // primeira execução
  const interval = setInterval(poll, pollInterval);
  return interval;
}

export function getLiveStatus() {
  return {
    live: lastLive,
    announced: announcedThisSession,
    stream: lastData ? {
      title: lastData.title,
      game: lastData.game_name,
      viewers: lastData.viewer_count,
      started_at: lastData.started_at,
      language: lastData.language
    } : null
  };
}

function buildYouTubeMessage(data, channelId){
  const videoId = data?.id?.videoId;
  const url = videoId ? `https://youtube.com/watch?v=${videoId}` : `https://youtube.com/channel/${channelId}`;
  return {
    content: '🔴 **YouTube Live Ativa**',
    embeds: [
      {
        title: data?.snippet?.title || 'Transmissão ao vivo',
        url,
        description: 'Severino Noctis ativo em canal YouTube. Relatório em andamento.',
        color: 0x556b2f,
        footer: { text: 'Watcher YouTube • Detecção inicial' }
      }
    ]
  };
}

function buildKickMessage(data, slug){
  const url = `https://kick.com/${slug}`;
  return {
    content: '🔴 **Kick Live Ativa**',
    embeds: [
      {
        title: data?.session_title || 'Transmissão Kick',
        url,
        description: 'Canal Kick ativo. Sessão operacional em paralelo.',
        color: 0x7c4f2b,
        footer: { text: 'Watcher Kick • Detecção inicial' }
      }
    ]
  };
}

export function startAggregatedWatcher(opts){
  const {
    discordClient,
    announceChannelId,
    twitch:{ channelLogin, clientId, clientSecret, announceOnce = true } = {},
    youtube:{ apiKey, channelId, announce = true } = {},
    kick:{ slug, announce: kickAnnounce = true } = {},
    pollInterval = 60000
  } = opts;

  if(!discordClient || !announceChannelId){
    console.log('[MultiWatcher] Discord/Channel ausentes.');
    return;
  }
  console.log('[MultiWatcher] Iniciado multi-plataforma.');
  const channel = () => discordClient.channels.cache.get(announceChannelId);

  async function poll(){
    // Twitch
    if(channelLogin){
      const { live, data } = await checkLive({ clientId, clientSecret, channelLogin });
      if(live && !lastLive){
        if(!announceOnce || (announceOnce && !announcedThisSession)){
          const c = channel();
            if(c){ c.send(buildDiscordMessage(data, channelLogin)); announcedThisSession = true; }
        }
      }
      lastLive = live; lastData = live ? data : null;
    }
    // YouTube
    if(apiKey && channelId){
      const { live, data } = await checkYouTubeLive({ apiKey, channelId });
      if(live && !ytLastLive && youtube.announce !== false){
        const c = channel(); if(c){ c.send(buildYouTubeMessage(data, channelId)); ytAnnounced = true; }
      }
      ytLastLive = live; ytLastData = live ? data : null;
    }
    // Kick
    if(slug){
      const { live, data } = await checkKickLive({ slug });
      if(live && !kickLastLive && kickAnnounce){
        const c = channel(); if(c){ c.send(buildKickMessage(data, slug)); kickAnnounced = true; }
      }
      kickLastLive = live; kickLastData = live ? data : null;
    }
  }
  poll();
  return setInterval(poll, pollInterval);
}

export function getPlatformStatuses(){
  return {
    twitch: getLiveStatus(),
    youtube: {
      live: ytLastLive,
      announced: ytAnnounced,
      stream: ytLastData ? { title: ytLastData.snippet?.title } : null
    },
    kick: {
      live: kickLastLive,
      announced: kickAnnounced,
      stream: kickLastData ? { title: kickLastData.session_title } : null
    }
  };
}
