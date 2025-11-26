# Migração de Usuários Antigos

## Problema
Você tem 2 usuários cadastrados antes da implementação de segurança PBKDF2. Esses usuários têm senhas com hash SHA-256 simples.

## Solução Automática (Recomendada)

Os usuários antigos **NÃO precisam fazer nada**! O sistema migra automaticamente:

1. Usuário faz login normalmente com email e senha
2. Sistema verifica a senha usando o método antigo (SHA-256)
3. Se válido, sistema automaticamente converte para PBKDF2
4. Próximo login já usa o formato seguro

### Como Funciona:
- O código em `lib/auth.ts` detecta hashes antigos (sem ':' no formato)
- Valida com o método antigo
- Re-hash a senha para PBKDF2
- Atualiza no banco de dados
- Registra no log de auditoria

## Solução Manual (Se Necessário)

Se os usuários esqueceram a senha ou você quer forçar reset:

### Opção 1: Reset via Neon Console

1. Acesse o Neon Console SQL Editor
2. Crie uma senha temporária segura (ex: `TrocaSenha123!`)
3. Execute no seu terminal local ou script Node.js:

\`\`\`javascript
const crypto = require('crypto');

const password = "TrocaSenha123!";
const salt = crypto.randomBytes(16);
const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
const hashedPassword = `${salt.toString('hex')}:${hash.toString('hex')}`;

console.log('Senha temporária:', password);
console.log('Hash PBKDF2:', hashedPassword);
\`\`\`

4. No Neon, execute:
\`\`\`sql
UPDATE users 
SET password = 'COLE_O_HASH_GERADO_AQUI'
WHERE email = 'email-do-usuario@exemplo.com';
\`\`\`

5. Avise o usuário para fazer login com a senha temporária

### Opção 2: Recriar os Usuários

Se preferir, delete os usuários antigos e peça para recriarem:

\`\`\`sql
-- Ver usuários com formato antigo
SELECT id, name, email FROM users 
WHERE password NOT LIKE '%:%';

-- Deletar usuário específico
DELETE FROM users WHERE email = 'email-do-usuario@exemplo.com';
\`\`\`

## Verificar Status dos Usuários

Para ver quais usuários já foram migrados:

\`\`\`sql
SELECT 
  id, 
  name, 
  email,
  CASE 
    WHEN password LIKE '%:%' THEN '✓ PBKDF2 Seguro'
    ELSE '⚠ SHA-256 Antigo'
  END as status_seguranca,
  created_at
FROM users
ORDER BY created_at DESC;
\`\`\`

## Logs de Migração

Quando um usuário é migrado automaticamente, um log é criado:

\`\`\`sql
SELECT l.*, u.name, u.email 
FROM logs l
JOIN users u ON l.user_id = u.id
WHERE l.action = 'security'
ORDER BY l.created_at DESC;
\`\`\`

## Recomendação

✅ **Use a migração automática** - Os usuários fazem login normalmente e o sistema cuida do resto.

Não é necessário fazer nada manualmente a menos que os usuários tenham esquecido suas senhas.
