import tmi from 'tmi.js';
import { getPlatformStatuses } from './liveWatcher.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export function startTwitchBot() {
  const username = process.env.TWITCH_USERNAME;
  const oauth = process.env.TWITCH_OAUTH;
  const channel = process.env.TWITCH_CHANNEL;
  const prefix = process.env.PREFIX || '!';

  if (!username || !oauth || !channel) {
    console.log('[Twitch] Credenciais ausentes. Configure .env');
    return;
  }

  const client = new tmi.Client({
    identity: { username, password: oauth },
    channels: [channel]
  });

  client.connect().then(() => console.log(`[Twitch] Conectado como ${username}`)).catch(console.error);

  client.on('message', (chan, tags, message, self) => {
    if (self) return;
    if (!message.startsWith(prefix)) return;

    const args = message.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    if (command === 'lore') {
      const id = args[0];
      if (!id) {
        client.say(chan, 'Uso: !lore <queda|lua|vaela>');
        return;
      }
      try {
        const eventosPath = path.join(process.cwd(), 'data', 'eventos.json');
        const raw = fs.readFileSync(eventosPath, 'utf-8');
        const json = JSON.parse(raw);
        const evento = json.lista.find(e => e.id === id);
        if (!evento) {
          client.say(chan, 'Evento não encontrado.');
        } else {
          client.say(chan, `${evento.titulo}: ${evento.descricao}`);
        }
      } catch (e) {
        client.say(chan, 'Falha ao ler eventos.');
      }
    }

    if (command === 'eco') {
      try {
        const personagemPath = path.join(process.cwd(), 'data', 'personagem.json');
        const raw = fs.readFileSync(personagemPath, 'utf-8');
        const personagem = JSON.parse(raw);
        client.say(chan, `Eco atual: ${personagem.identidade.nome} fase ${personagem.estado.fase}`);
      } catch (e) {
        client.say(chan, 'Falha ao ler personagem.');
      }
    }

    if (command === 'ritual') {
      client.say(chan, 'O ritual ainda não foi decifrado. Fragmentos pendentes...');
    }

    if (command === 'plataformas') {
      try {
        const status = getPlatformStatuses();
        const fmt = (p) => p.live ? 'AO VIVO' : 'offline';
        client.say(chan, `Status -> Twitch: ${fmt(status.twitch)} | YouTube: ${fmt(status.youtube)} | Kick: ${fmt(status.kick)}`);
      } catch (e) {
        client.say(chan, 'Falha ao obter status multi-stream.');
      }
    }
  });
}
