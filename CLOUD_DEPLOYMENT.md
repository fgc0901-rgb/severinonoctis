# Deploy em Nuvem (Severino Noctis)

## Visão Geral
Arquitetura proposta separa o front (estático + PWA) em CDN e os serviços dinâmicos (bots + status + pontos) em contêiner persistente.

| Componente | Tipo | Requisitos |
|------------|------|------------|
| Frontend (index.html, assets) | Estático (CDN) | HTTPS, cache longo, SW habilitado |
| Bots + Watchers | Node processo contínuo | Variáveis de ambiente secretas |
| Status Server (/status) | Express (porta 3080) | Saúde e monitoramento |
| Points Endpoint (/points) | Integrado Express 3080 | CSV montado ou volume |

## Opções de Hospedagem
### Frontend
- Cloudflare Pages / GitHub Pages / Vercel / Netlify.
- Recomendado: Cloudflare Pages (cache agressivo + fácil redirect). Basta conectar repositório e publicar diretório raiz.

### Backend (Bots + API)
- VPS (DigitalOcean, Hetzner, AWS EC2) com Docker Compose.
- Render.com (serviço contêiner sempre-on) ou Fly.io (regiões otimizadas + TCP). Necessário manter processo rodando.
- Serverless NÃO ideal para watchers (polling persistente). Prefira contêiner.

## Docker Compose
Arquivo `docker-compose.yml` cria dois serviços:
```bash
docker compose up --build -d
```
Frontend em `http://localhost:8080/`, API unificada `http://localhost:3080/status` e `http://localhost:3080/points`.

## Variáveis de Ambiente (bot/.env)
Preencha conforme `bot/.env.example`. Nunca commitar `.env`.
Sugestão de gestão em produção:
- Docker secrets (Swarm) ou arquivo montado via volume.
- Em plataformas gerenciadas, inserir secrets via painel.

## Domínio & HTTPS
1. Apontar domínio (ex: bobbunitinho.com) para CDN do frontend.
2. Subdomínio para backend (ex: api.bobbunitinho.com) via reverse proxy (NGINX ou Traefik) apontado para serviço bots.
3. Configurar TLS (Let's Encrypt) com automação (Traefik) ou Cloudflare proxy.

### Exemplo NGINX Reverse Proxy (trecho)
```
server {
  server_name api.bobbunitinho.com;
  location /status { proxy_pass http://bots:3080/status; }
  location /points { proxy_pass http://bots:4580; }
}
```

## Estratégia de Cache
- Imagens RDR2: CDN com `Cache-Control: public, max-age=604800` (1 semana). Service Worker já faz runtime.
- HTML: `no-cache` para garantir atualização imediata.
- JSON de dados: curto (ex: 5 min) se passar a ser remoto.

## Logs & Monitoramento
- Adicionar futuro: Winston ou Pino para JSON estruturado.
- Coletar métricas: contagem de polls sucesso/erro exposta em `/status` (extensão futura).
- Healthcheck Docker: `curl -f http://localhost:3080/status || exit 1`.

## Backup & Persistência
- CSV de pontos: montar volume externo `content_points.csv` para evitar perda ao atualizar imagem.
- Imagens: armazenamento em bucket (S3 / R2) + sync local opcional.

## CI/CD Simples (GitHub Actions)
Exemplo jobs:
1. Lint + scan.
2. Publish frontend (Pages).
3. Build & push Docker image (bots) para registry.
4. Deploy (SSH ou API) reiniciando compose.

## Próximas Melhorias
- Separar Points Server em rota `/api/points` atrás do mesmo contêiner Express.
- Auth token simples para endpoints se expostos publicamente.
- Rate limit em anúncios Discord para evitar flood.
- Internacionalização (pt/en) via JSON.

## Comandos Essenciais
```bash
# Build e subir tudo
docker compose up --build -d

# Ver logs bots
docker compose logs -f bots

# Reiniciar somente bots
docker compose restart bots

# Atualizar (pull repositório + rebuild)
git pull
docker compose build bots
docker compose up -d bots

# Remover serviços
docker compose down
```

## GitHub Actions & Publicação
Já incluídos:
- `deploy-frontend.yml`: publica conteúdo estático em GitHub Pages (branch principal -> ambiente Pages). Após primeira execução habilite Pages em Settings.
- `build-bots.yml`: gera imagem Docker dos bots (Discord/Twitch/YouTube/Kick + points) e publica em GHCR.

### Secrets Necessários (Configurar em Settings > Secrets > Actions)
| Nome | Uso |
|------|-----|
| VPS_HOST | Host/IP servidor para deploy opcional |
| VPS_USER | Usuário SSH |
| VPS_KEY  | Chave privada SSH (PEM) |
| DISCORD_TOKEN | (Não usado no build, mas exigido no runtime .env no servidor) |
| TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET | Runtime bots |
| YOUTUBE_API_KEY | Runtime bots |
| YOUTUBE_CHANNEL_ID | Runtime bots |
| KICK_CHANNEL_SLUG | Runtime bots |

Somente VPS_* tornam job `deploy-vps` ativo; caso contrário apenas image push.

### Fluxo de Deploy Rápido
1. Commit & push `main`.
2. Workflow `Deploy Frontend` publica site (ver URL gerada).
3. Workflow `Build & Publish Bots` atualiza imagem em GHCR.
4. VPS job (se secrets presentes) faz pull e reinicia serviço bots.
5. Verificar `/status` e páginas offline-first.

### Personalizar Domínio
GitHub Pages: arquivo `CNAME` já incluso com `bobbunitinho.com`.
Registros DNS necessários (sem Cloudflare):
```
Tipo  A   bobbunitinho.com -> 185.199.108.153
Tipo  A   bobbunitinho.com -> 185.199.109.153
Tipo  A   bobbunitinho.com -> 185.199.110.153
Tipo  A   bobbunitinho.com -> 185.199.111.153
```
Se quiser também `www.bobbunitinho.com`:
```
Tipo CNAME  www -> bobbunitinho.com
```

Com Cloudflare (recomendado): criar mesmos A records (proxied) e um CNAME para `www`. Certifique-se de TLS Full e regra de cache para imagens (1w). HTML manter `Cache-Control: no-cache`.

Após propagar DNS (até ~30min), acesse Settings > Pages e confirme domínio custom. Verifique se GitHub Pages gerou certificado SSL (pode levar alguns minutos).

Teste de verificação:
```bash
curl -I https://bobbunitinho.com/
```
Esperar status 200 e cabeçalho `Server: GitHub.com`.
CDN externo (Cloudflare): aponte DNS para Pages, depois ajuste cache rules (imagens 1w, html no-cache).

---

## Segurança Rápida
- Nunca expor tokens Discord/Twitch em logs públicos.
- Usar firewall para permitir acesso externo apenas às portas 8080 (HTTP público) e proxy API.
- Ativar atualizações automáticas de patches no host.

## Verificação Pós-Deploy
1. `curl -I https://seu-dominio/` retorna 200 e cabeçalhos cache.
2. `curl https://api.seu-dominio/status` mostra JSON com plataformas.
3. Discord canal recebe anúncio ao iniciar live.
4. PWA instala e offline carrega `index.html`.
5. Points endpoint `/points` retorna dados agregados sem erro.

---
Em caso de dúvidas sobre provider específico, informe a escolha (AWS, Cloudflare, etc.) para instruções detalhadas.
