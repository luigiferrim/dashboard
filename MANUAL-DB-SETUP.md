# Como Atualizar o Banco de Dados Neon Manualmente

## Passo 1: Acessar o Neon Console

1. Acesse [https://console.neon.tech](https://console.neon.tech)
2. Faça login na sua conta
3. Selecione seu projeto
4. Clique em **SQL Editor** no menu lateral

## Passo 2: Verificar Estrutura Atual

Execute este comando primeiro para ver quais colunas existem:

\`\`\`sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'lots' 
ORDER BY ordinal_position;
\`\`\`

## Passo 3: Adicionar Colunas Faltantes

Se a coluna "supplier" não existir, execute os comandos abaixo **UM POR VEZ**:

\`\`\`sql
-- Adicionar coluna supplier (se não existir)
ALTER TABLE lots ADD COLUMN IF NOT EXISTS supplier VARCHAR(255);
\`\`\`

\`\`\`sql
-- Adicionar coluna variety (se não existir)
ALTER TABLE lots ADD COLUMN IF NOT EXISTS variety VARCHAR(255);
\`\`\`

\`\`\`sql
-- Adicionar coluna process (se não existir)
ALTER TABLE lots ADD COLUMN IF NOT EXISTS process VARCHAR(255);
\`\`\`

\`\`\`sql
-- Adicionar coluna roast_date (se não existir)
ALTER TABLE lots ADD COLUMN IF NOT EXISTS roast_date TIMESTAMP;
\`\`\`

## Passo 4: Verificar se Funcionou

Execute novamente o comando do Passo 2 para confirmar que as colunas foram adicionadas.

Você deve ver as seguintes colunas:
- id
- name
- quantity
- cost_price
- sale_price
- **supplier** ← Esta deve aparecer agora
- category
- **variety** ← Nova
- **process** ← Nova
- **roast_date** ← Nova
- expiry_date
- status
- created_at
- updated_at

## Passo 5: Testar o Sistema

Após executar os comandos acima, volte ao seu dashboard e tente criar um novo lote de café. Agora deve funcionar!

## Solução de Problemas

Se ainda houver erro, execute este comando para recriar a tabela completa:

\`\`\`sql
-- ATENÇÃO: Isso vai apagar todos os lotes existentes!
-- Só use se a tabela estiver vazia ou você não se importar em perder os dados

DROP TABLE IF EXISTS lots CASCADE;

CREATE TABLE lots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2) NOT NULL,
  supplier VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  variety VARCHAR(255),
  process VARCHAR(255),
  roast_date TIMESTAMP,
  expiry_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Recriar os índices
CREATE INDEX idx_lots_status ON lots(status);
CREATE INDEX idx_lots_roast_date ON lots(roast_date);
CREATE INDEX idx_lots_category ON lots(category);
