# Sistema de Gestão de Estoque

Sistema full-stack de gestão de estoque construído com Next.js 15, TypeScript, Tailwind CSS, Neon PostgreSQL e NextAuth.

## Funcionalidades

- **Autenticação**: Login e registro seguro com NextAuth (Credentials) e bcrypt
- **Dashboard**: Visão geral com métricas em tempo real, gráficos interativos e alertas de vencimento
- **Estoque**: Gerenciamento completo de lotes com busca, filtros e modal de criação
- **Financeiro**: Análise financeira detalhada com gráficos de pizza, rankings e tabelas
- **Histórico**: Sistema de auditoria completo com logs de todas as ações e filtros

## Tecnologias

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: NextAuth v4 com Credentials Provider
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Date**: date-fns

## Configuração Local

### 1. Clonar o repositório

\`\`\`bash
git clone <seu-repositorio>
cd <nome-do-projeto>
\`\`\`

### 2. Instalar dependências

\`\`\`bash
npm install
# ou
bun install
\`\`\`

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
# Neon Database
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-aqui"  # Gere com: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

### 4. Configurar banco de dados

Execute o script SQL para criar as tabelas:

\`\`\`bash
# O script está em: scripts/001-create-tables.sql
# Execute diretamente no Neon Dashboard ou use o psql:
psql $DATABASE_URL -f scripts/001-create-tables.sql
\`\`\`

Ou execute manualmente as queries SQL:

\`\`\`sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  unit VARCHAR(50) NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  expiration_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lots_user_id ON lots(user_id);
CREATE INDEX idx_lots_status ON lots(status);
CREATE INDEX idx_lots_expiration ON lots(expiration_date);
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_created_at ON logs(created_at);
\`\`\`

### 5. Executar o projeto

\`\`\`bash
npm run dev
# ou
bun dev
\`\`\`

Acesse: http://localhost:3000

## Estrutura do Banco de Dados

### Tabela: users
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único do usuário |
| name | VARCHAR(255) | Nome completo |
| email | VARCHAR(255) | Email (único) |
| password | VARCHAR(255) | Senha criptografada (bcrypt) |
| created_at | TIMESTAMP | Data de criação |

### Tabela: lots
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único do lote |
| name | VARCHAR(255) | Nome do produto |
| category | VARCHAR(100) | Categoria do produto |
| quantity | INTEGER | Quantidade em estoque |
| unit | VARCHAR(50) | Unidade de medida |
| cost_price | DECIMAL(10,2) | Preço de custo |
| sale_price | DECIMAL(10,2) | Preço de venda |
| expiration_date | DATE | Data de validade |
| status | VARCHAR(50) | Status (active/inactive) |
| user_id | INTEGER | ID do usuário responsável |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: logs
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único do log |
| user_id | INTEGER | ID do usuário que executou a ação |
| action | VARCHAR(100) | Tipo de ação (login, create_lot, etc) |
| details | TEXT | Detalhes adicionais em JSON |
| created_at | TIMESTAMP | Data da ação |

## Deploy na Vercel

### 1. Preparar o banco de dados

Se ainda não tiver um banco Neon:
1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a connection string

### 2. Deploy no Vercel

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente:
   - `DATABASE_URL` - Connection string do Neon
   - `NEXTAUTH_SECRET` - Gere com: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - URL do seu app (ex: https://seu-app.vercel.app)

### 3. Executar as migrations

Após o primeiro deploy, execute o script SQL no Neon Dashboard para criar as tabelas.

## Scripts Úteis

\`\`\`bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint
\`\`\`

## Estrutura de Pastas

\`\`\`
.
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # NextAuth
│   │   ├── lots/              # CRUD de lotes
│   │   ├── logs/              # Logs de auditoria
│   │   ├── dashboard/         # Estatísticas
│   │   └── register/          # Registro de usuários
│   ├── dashboard/             # Página dashboard
│   ├── estoque/               # Página estoque
│   ├── financeiro/            # Página financeiro
│   ├── historico/             # Página histórico
│   ├── login/                 # Página login
│   ├── register/              # Página registro
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/             # Componentes do dashboard
│   ├── estoque/               # Componentes do estoque
│   ├── layout/                # Layout (navbar)
│   ├── providers/             # Providers (session)
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts                # Configuração NextAuth
│   └── db.ts                  # Cliente Neon
├── scripts/
│   └── 001-create-tables.sql  # Script de criação das tabelas
├── types/
│   └── next-auth.d.ts         # Types do NextAuth
└── middleware.ts              # Proteção de rotas
\`\`\`

## Páginas e Rotas

### Públicas
- `/` - Landing page
- `/login` - Página de login
- `/register` - Página de registro

### Protegidas (requer autenticação)
- `/dashboard` - Dashboard com métricas e gráficos
- `/estoque` - Gerenciamento de lotes
- `/financeiro` - Análise financeira
- `/historico` - Histórico de auditoria

## API Endpoints

### Auth
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Lots (Lotes)
- `GET /api/lots` - Listar todos os lotes do usuário
- `POST /api/lots` - Criar novo lote
- `PUT /api/lots/[id]` - Atualizar lote existente
- `POST /api/lots/[id]/delete` - Deletar lote

### Dashboard
- `GET /api/dashboard/stats` - Obter estatísticas do dashboard

### Logs
- `GET /api/logs` - Listar logs de auditoria

### Register
- `POST /api/register` - Registrar novo usuário

## Segurança

- Senhas criptografadas com bcrypt (10 rounds)
- Autenticação JWT via NextAuth
- Middleware protegendo rotas privadas
- SQL queries parametrizadas (proteção contra SQL injection)
- CORS configurado
- Validação de dados com Zod

## Sistema de Auditoria

Todas as ações são registradas na tabela `logs`:

- **LOGIN** - Quando usuário faz login
- **CREATE_LOT** - Quando novo lote é criado
- **UPDATE_LOT** - Quando lote é atualizado
- **DELETE_LOT** - Quando lote é deletado

## Features Destacadas

- **Alertas de Vencimento**: Lotes com mais de 60 dias até vencimento são destacados
- **Gráficos Interativos**: Recharts para visualização de dados
- **Busca e Filtros**: Busca em tempo real nos lotes
- **Modo Responsivo**: Interface adaptada para mobile e desktop
- **Modal de Criação**: Formulário completo para adicionar novos lotes
- **Estatísticas em Tempo Real**: Dashboard atualizado automaticamente
- **Sistema de Categorias**: Organização por categorias de produtos

## Suporte

Para problemas ou dúvidas, abra uma issue no GitHub.

## Licença

MIT
