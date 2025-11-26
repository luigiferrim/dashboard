# Como Corrigir o Banco de Dados Agora

## Passo a Passo Rápido:

### 1. Acesse o Neon Console
- Vá para: https://console.neon.tech
- Faça login na sua conta

### 2. Selecione seu Projeto
- Clique no projeto "Coxilha Coffee" (ou o nome do seu projeto)

### 3. Abra o SQL Editor
- No menu lateral esquerdo, clique em **"SQL Editor"**
- Ou acesse a aba **"Console"** e depois **"SQL Editor"**

### 4. Execute o Script
- Copie **TODO** o conteúdo do arquivo `scripts/005-complete-database-fix.sql`
- Cole no SQL Editor do Neon
- Clique no botão **"Run"** ou pressione `Ctrl+Enter`

### 5. Verifique os Resultados
Você deve ver mensagens como:
\`\`\`
✓ Coluna lot_id adicionada à tabela logs
✓ Coluna unit removida da tabela lots
✓ Coluna supplier adicionada à tabela lots
✓ Coluna variety adicionada à tabela lots
✓ Coluna process adicionada à tabela lots
✓ Coluna roast_date adicionada à tabela lots
\`\`\`

### 6. Teste Novamente
Volte para o app e tente criar um novo lote de café!

---

## O Que Este Script Faz?

Este script corrige automaticamente todas as diferenças entre o schema no código e o banco de dados real:

1. **Adiciona lot_id na tabela logs** - Para registrar qual lote foi modificado
2. **Remove a coluna unit** - Coluna antiga que não é mais usada
3. **Adiciona supplier** - Fornecedor do café
4. **Adiciona variety** - Variedade do café (ex: Catuaí, Bourbon)
5. **Adiciona process** - Processo (Natural, Lavado, etc)
6. **Adiciona roast_date** - Data da torra (substituindo expiry_date)
7. **Cria índices** - Para melhorar performance

O script é **seguro** e verifica se cada coluna já existe antes de tentar adicioná-la, então você pode executá-lo múltiplas vezes sem problemas.

---

## Problemas?

Se ainda tiver erros após executar o script, me avise qual mensagem de erro aparece!
