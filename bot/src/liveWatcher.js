// Live watcher usando Twitch Helix
// Requer: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_CHANNEL, DISCORD_ANNOUNCE_CHANNEL_ID
// Fluxo: Obtém app token, faz polling em /streams?user_login=, detecta transição offline->live e anuncia.

let lastLive = false;
let announcedThisSession = false;
let accessToken = null;
let tokenExpiry = 0;
let lastData = null;

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
