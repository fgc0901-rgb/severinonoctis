import { startDiscordBot } from './discordBot.js';
import { startTwitchBot } from './twitchBot.js';
import { startAggregatedWatcher } from './liveWatcher.js';
import { startStatusServer } from './statusServer.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('Iniciando bots Severino Noctis...');
const discordClient = startDiscordBot();
startTwitchBot();
startStatusServer();

// Inicia watcher de live após pequeno atraso para garantir login do Discord
setTimeout(() => {
	if (discordClient) {
		startAggregatedWatcher({
			discordClient,
			announceChannelId: process.env.DISCORD_ANNOUNCE_CHANNEL_ID,
			twitch: {
				channelLogin: process.env.TWITCH_CHANNEL,
				clientId: process.env.TWITCH_CLIENT_ID,
				clientSecret: process.env.TWITCH_CLIENT_SECRET,
				announceOnce: (process.env.TWITCH_LIVE_ANNOUNCE_ONCE || 'true') === 'true'
			},
			youtube: {
				apiKey: process.env.YOUTUBE_API_KEY,
				channelId: process.env.YOUTUBE_CHANNEL_ID,
				announce: (process.env.YOUTUBE_LIVE_ANNOUNCE || 'true') === 'true'
			},
			kick: {
				slug: process.env.KICK_CHANNEL_SLUG,
				announce: (process.env.KICK_LIVE_ANNOUNCE || 'true') === 'true'
			},
			pollInterval: parseInt(process.env.MULTILIVE_POLL_INTERVAL_MS || process.env.POLL_INTERVAL_MS || '60000',10)
		});
	} else {
		console.log('[MultiWatcher] Discord não inicializado, pulando watcher.');
	}
}, 5000);
