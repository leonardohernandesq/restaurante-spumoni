# Guia de Deploy - Restaurante Spumoni

Este documento apresenta as instruções para deploy do projeto Restaurante Spumoni em diferentes ambientes.

## Pré-requisitos

- Node.js 20.x ou superior
- Yarn ou NPM
- Conta na plataforma de deploy escolhida (Vercel, AWS, Azure, etc.)
- Acesso ao repositório Git do projeto

## Ambientes

O projeto possui três ambientes principais:

1. **Desenvolvimento (dev)**: Para testes durante o desenvolvimento
2. **Homologação (staging)**: Para validação final antes da produção
3. **Produção (prod)**: Ambiente de produção acessado pelos usuários finais

## Variáveis de Ambiente

Para cada ambiente, é necessário configurar as seguintes variáveis de ambiente:

```
NEXT_PUBLIC_API_URL=https://api.[ambiente].restaurantespumoni.com.br
```

## Deploy na Vercel (Recomendado)

A Vercel é a plataforma recomendada para deploy do projeto, pois é otimizada para aplicações Next.js.

### Passos para Deploy

1. Crie uma conta na [Vercel](https://vercel.com) se ainda não possuir
2. Importe o projeto do GitHub, GitLab ou Bitbucket
3. Configure as variáveis de ambiente para cada ambiente
4. Configure os domínios personalizados para cada ambiente
5. Ative a integração contínua para deploy automático a partir da branch principal

### Configuração de Domínios

- **Desenvolvimento**: dev.restaurantespumoni.com.br
- **Homologação**: staging.restaurantespumoni.com.br
- **Produção**: restaurantespumoni.com.br

## Deploy no AWS Amplify

### Passos para Deploy

1. Acesse o AWS Management Console e navegue até o AWS Amplify
2. Clique em "New app" > "Host web app"
3. Conecte o repositório Git e selecione a branch para deploy
4. Configure o build com as seguintes especificações:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - yarn install
    build:
      commands:
        - yarn build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

5. Configure as variáveis de ambiente
6. Configure os domínios personalizados

## Deploy Manual em Servidor Linux

### Pré-requisitos

- Servidor Ubuntu 20.04 LTS ou superior
- Nginx instalado
- PM2 instalado globalmente
- Certificado SSL (Let's Encrypt recomendado)

### Passos para Deploy

1. Clone o repositório no servidor:

```bash
git clone https://github.com/seu-usuario/restaurante-spumoni.git
cd restaurante-spumoni
```

2. Instale as dependências:

```bash
yarn install
```

3. Crie o arquivo `.env` com as variáveis de ambiente para produção

4. Faça o build da aplicação:

```bash
yarn build
```

5. Configure o PM2 para gerenciar o processo:

```bash
pm2 start yarn --name "restaurante-spumoni" -- start
pm2 save
pm2 startup
```

6. Configure o Nginx:

```nginx
server {
    listen 80;
    server_name restaurantespumoni.com.br www.restaurantespumoni.com.br;
    
    # Redirecionamento para HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name restaurantespumoni.com.br www.restaurantespumoni.com.br;

    ssl_certificate /etc/letsencrypt/live/restaurantespumoni.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/restaurantespumoni.com.br/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. Reinicie o Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Deploy com Docker

### Pré-requisitos

- Docker e Docker Compose instalados
- Acesso ao Docker Hub ou outro registro de imagens

### Arquivo Dockerfile

Crie um arquivo `Dockerfile` na raiz do projeto:

```dockerfile
FROM node:20-alpine AS base

# Instala dependências apenas
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Aplicação final
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3'

services:
  web:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.restaurantespumoni.com.br
    volumes:
      - ./public:/app/public
```

### Executando com Docker

```bash
# Build da imagem
docker-compose build

# Iniciar os containers
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

## CI/CD com GitHub Actions

Para automatizar o processo de deploy, você pode utilizar o GitHub Actions.

Crie um arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy Application

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Build
        run: yarn build
        
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-args: '--prod'
```

## Monitoramento e Logs

Para monitorar a aplicação em produção, recomendamos:

1. **Vercel Analytics**: Se estiver usando a Vercel, ative o Analytics
2. **Sentry**: Para monitoramento de erros
3. **Google Analytics**: Para análise de tráfego e comportamento do usuário

## Rollback

### Na Vercel

1. Acesse o dashboard da Vercel
2. Navegue até o projeto
3. Vá para a aba "Deployments"
4. Encontre o deploy anterior estável
5. Clique nos três pontos (...) e selecione "Promote to Production"

### Com Git

```bash
# Identificar o commit estável anterior
git log --oneline

# Reverter para esse commit
git revert [hash-do-commit]

# Push das alterações
git push origin main
```

## Backup

Certifique-se de fazer backups regulares:

1. Código fonte (via Git)
2. Configurações de ambiente
3. Dados do banco de dados (se aplicável)

## Contatos para Suporte

Em caso de problemas com o deploy, entre em contato com:

- **Equipe DevOps**: devops@restaurantespumoni.com.br
- **Desenvolvedor Principal**: dev@restaurantespumoni.com.br 