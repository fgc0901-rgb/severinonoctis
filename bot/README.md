# Bots Severino Noctis

Estrutura inicial de bots para Discord e Twitch fornecendo comandos de lore e expansão futura de anúncios cruzados.

## Comandos Atuais
| Comando | Discord | Twitch | Descrição |
|---------|---------|--------|-----------|
| !lore <id> | ✅ | ✅ | Mostra evento (queda, lua, vaela) |
| !eco | ✅ | ✅ | Estado atual do personagem |
| !ritual | ❌ | ✅ | Placeholder de ritual incompleto |
| !live | ✅ | ❌ | Divulga link da Twitch (bobbunitinhu) configurado |

## Detecção Automática de Live
Watcher Helix integrado (`liveWatcher.js`). Quando o canal entra ao vivo:
- Faz polling em `streams?user_login=<canal>` (intervalo configurável via `POLL_INTERVAL_MS`).
- Envia embed no canal Discord definido por `DISCORD_ANNOUNCE_CHANNEL_ID`.
- Respeita `TWITCH_LIVE_ANNOUNCE_ONCE` para não repetir em cada polling.

### Variáveis Necessárias
```
TWITCH_CLIENT_ID=seu_client_id
TWITCH_CLIENT_SECRET=seu_client_secret
DISCORD_ANNOUNCE_CHANNEL_ID=123456789012345678
POLL_INTERVAL_MS=60000
TWITCH_LIVE_ANNOUNCE_ONCE=true
STATUS_PORT=3080
```

### Permissões
O bot Discord precisa de permissão de leitura e envio de mensagens no canal de anúncios.

### Limitações
- Polling simples (sem Webhooks EventSub). Para escalonar, migrar para EventSub + subscrição.
- Sem cache persistente: reinício do processo permite novo anúncio.
 - Painel /status não exige autenticação (não exponha publicamente sem proxy/restrição).

## Requisitos
- Node.js 18+
- Criar arquivo `.env` baseado em `.env.example`

## .env
```
DISCORD_TOKEN=seu_token
DISCORD_CLIENT_ID=opcional
DISCORD_GUILD_ID=opcional
TWITCH_USERNAME=seu_usuario
TWITCH_OAUTH=oauth:xxxxxxxxxxxxxxxxxxxx
TWITCH_CHANNEL=canal
TWITCH_LINK=https://twitch.tv/bobbunitinhu
PREFIX=!
```
Obter OAuth Twitch: https://twitchapps.com/tmi/

## Instalação
```powershell
# Na pasta bot/
npm install
npm run start
```

## Estrutura
```
bot/
  package.json
  .env.example
  src/
    index.js          # Inicializa ambos bots
    discordBot.js     # Lê JSON e responde comandos
    twitchBot.js      # Chat bot
```

## Extensões Futuras Planejadas
- Anúncio de live via Discord ao conectar Twitch (webhook).
- Comando !fragmento para sortear item de `itens.json`.
- Sistema de cooldown por usuário.
- Conversão para comandos slash no Discord.
 - Verificação automática se canal está ao vivo (API Helix) e atualização de mensagem fixada.
 - Migrar de polling para EventSub e armazenar estado em Redis.
 - Adicionar /metrics em formato Prometheus.
 - Autenticação básica no painel status.

## Boas Práticas
- Nunca commitar `.env`.
- Rotacionar credenciais periodicamente.
- Limitar permissões do bot Discord (apenas leitura de canais necessários).

## Próximos Passos
1. Adicionar checks de cooldown.
2. Implementar webhook de anúncio.
3. Criar módulo de `rituais.json` e resposta detalhada.
4. Adicionar logs estruturados.
