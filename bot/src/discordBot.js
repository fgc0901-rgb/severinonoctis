import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { getPlatformStatuses } from './liveWatcher.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.DISCORD_TOKEN;
const prefix = process.env.PREFIX || '!';

export function startDiscordBot() {
  if (!token) {
    console.log('[Discord] Token ausente. Configure .env');
    return;
  }
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
  });

  client.once('ready', () => {
    console.log(`[Discord] Logado como ${client.user.tag}`);
  });

  client.on('messageCreate', (msg) => {
    if (msg.author.bot || !msg.content.startsWith(prefix)) return;
    const args = msg.content.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    if (command === 'lore') {
      const id = args[0];
      if (!id) {
        msg.reply('Uso: !lore <queda|lua|vaela>');
        return;
      }
      try {
        const eventosPath = path.join(process.cwd(), 'data', 'eventos.json');
        const raw = fs.readFileSync(eventosPath, 'utf-8');
        const json = JSON.parse(raw);
        const evento = json.lista.find(e => e.id === id);
        if (!evento) {
          msg.reply('Evento não encontrado.');
        } else {
          msg.reply(`**${evento.titulo}** (${evento.epoca})\n${evento.descricao}`);
        }
      } catch (e) {
        msg.reply('Falha ao ler eventos.');
        console.error(e);
      }
    }

    if (command === 'eco') {
      try {
        const personagemPath = path.join(process.cwd(), 'data', 'personagem.json');
        const raw = fs.readFileSync(personagemPath, 'utf-8');
        const personagem = JSON.parse(raw);
        msg.reply(`Identidade: ${personagem.identidade.nome} | Estado: ${personagem.estado.fase}`);
      } catch (e) {
        msg.reply('Falha ao ler personagem.');
      }
    }

    if (command === 'live') {
      const twitchLink = process.env.TWITCH_LINK || `https://twitch.tv/${process.env.TWITCH_CHANNEL || 'bobbunitinhu'}`;
      msg.reply({
        content: `🔴 Transmissão de Severino Noctis em breve / ativa: ${twitchLink}`
      });
    }

    if (command === 'plataformas') {
      try {
        const status = getPlatformStatuses();
        const fmt = (p) => p.live ? 'AO VIVO' : 'offline';
        const twitchUrl = process.env.TWITCH_LINK || `https://twitch.tv/${process.env.TWITCH_CHANNEL}`;
        const ytUrl = status.youtube.stream ? `https://youtube.com/watch?v=${status.youtube.stream.title ? '' : ''}` : `https://youtube.com/channel/${process.env.YOUTUBE_CHANNEL_ID || ''}`;
        const kickUrl = `https://kick.com/${process.env.KICK_CHANNEL_SLUG || ''}`;
        msg.reply(
          `Status Plataformas:\n` +
          `• Twitch: ${fmt(status.twitch)} (${twitchUrl})\n` +
          `• YouTube: ${fmt(status.youtube)}\n` +
          `• Kick: ${fmt(status.kick)} (${kickUrl})`
        );
      } catch (e) {
        msg.reply('Falha ao obter status multi-stream.');
      }
    }
  });

  client.login(token);
  return client;
}

export function getDiscordClient() {}
