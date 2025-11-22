import { startDiscordBot } from './discordBot.js';
import { startTwitchBot } from './twitchBot.js';
import { startLiveWatcher } from './liveWatcher.js';
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
		startLiveWatcher({
			discordClient,
			channelLogin: process.env.TWITCH_CHANNEL,
			announceChannelId: process.env.DISCORD_ANNOUNCE_CHANNEL_ID,
			clientId: process.env.TWITCH_CLIENT_ID,
			clientSecret: process.env.TWITCH_CLIENT_SECRET,
			pollInterval: parseInt(process.env.POLL_INTERVAL_MS || '60000', 10),
			announceOnce: (process.env.TWITCH_LIVE_ANNOUNCE_ONCE || 'true') === 'true'
		});
	} else {
		console.log('[LiveWatcher] Discord não inicializado, pulando watcher.');
	}
}, 5000);
