# clone-tabnews

Implementação do [TabNews](https://www.tabnews.com.br) desenvolvida no curso do Felipe Deschamps.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS Hydrogen — ver `.nvmrc`)
- [Docker](https://www.docker.com/) e Docker Compose
- npm

## Começando

Clone o repositório e instale as dependências:

```bash
git clone git@github.com:kaiocesar0/clone-tabnews.git
cd clone-tabnews
npm install
```

As variáveis de ambiente de desenvolvimento ficam em `.env.development` (já versionada para uso local).

## Rodar o projeto

Sobe o Postgres, espera o banco ficar pronto, aplica as migrations e inicia o Next.js:

```bash
npm run dev
```

A aplicação fica disponível em [http://localhost:3000](http://localhost:3000).

## Serviços (Docker)

```bash
# Sobe o Postgres em background
npm run services:up

# Aguarda o Postgres aceitar conexões
npm run services:wait:database

# Para os containers (mantém os dados)
npm run services:stop

# Remove os containers
npm run services:down
```

## Migrations

As migrations usam [`node-pg-migrate`](https://github.com/salsita/node-pg-migrate) e ficam em `infra/migrations`.

```bash
# Cria uma nova migration
npm run migrations:create nome-da-migration

# Aplica as migrations pendentes (usa .env.development)
npm run migrations:up
```

O `npm run dev` já executa `migrations:up` automaticamente antes de iniciar o servidor.

Também é possível consultar ou aplicar migrations via API:

- `GET /api/v1/migrations` — lista migrations pendentes
- `POST /api/v1/migrations` — aplica as migrations pendentes

## Testes

```bash
# Roda a suíte de testes uma vez (sobe serviços, Next e Jest)
npm test

# Modo watch
npm run test:watch
```

## Lint e formatação

```bash
# Verifica formatação com Prettier
npm run lint:prettier:check

# Corrige formatação com Prettier
npm run lint:prettier:fix

# Verifica regras do ESLint
npm run lint:eslint:check
```

## Commits

O projeto usa [Commitizen](https://github.com/commitizen/cz-cli) com Conventional Commits:

```bash
npm run commit
```

## Licença

Este projeto está sob a licença [MIT](LICENSE).
