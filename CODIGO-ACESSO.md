# Configuração do Código de Acesso Mestre

## O que é?

O Código de Acesso Mestre é uma camada adicional de segurança que exige que todos os usuários, mesmo após fazer login, digitem um código secreto para acessar o dashboard do Coxilha Coffee.

## Como Funciona?

1. Usuário faz login com email e senha
2. Sistema pede o "Código de Acesso"
3. Usuário digita o código mestre (compartilhado apenas com funcionários autorizados)
4. Se correto, acessa o dashboard
5. Se incorreto, fica bloqueado após 3 tentativas por 1 hora

## Configuração no Vercel

### 1. Acesse as Variáveis de Ambiente

- Vá para https://vercel.com
- Acesse seu projeto "Coxilha Coffee"
- Clique em **Settings** → **Environment Variables**

### 2. Adicione a Variável

Adicione uma nova variável:

- **Name:** `MASTER_ACCESS_CODE`
- **Value:** Seu código secreto (exemplo: `CoxilhaCafe2025`, `Cafe@Seguro123`, etc.)
- **Environments:** Selecione Production, Preview e Development

**Importante:** Use um código forte com pelo menos 8 caracteres, misturando letras, números e símbolos.

### 3. Redeploy

Após adicionar a variável, faça um novo deploy para aplicar as mudanças.

## Recomendações de Segurança

### Código Forte
- Mínimo 8 caracteres
- Misture letras maiúsculas e minúsculas
- Inclua números
- Adicione símbolos especiais (!@#$%^&*)

### Exemplos de Códigos Fortes
- `Cx!lh@2025#Cafe`
- `T0rr@Caf3*2025`
- `Gr@osEsp3c!@1s`

### Não Use
- Senhas óbvias: `123456`, `senha`, `admin`
- Palavras do dicionário: `cafe`, `coffee`, `coxilha`
- Datas: `2025`, `01012025`

## Compartilhamento do Código

- **Compartilhe apenas:** Com funcionários autorizados
- **Não compartilhe:** Por email, WhatsApp ou redes sociais
- **Troca regular:** Mude o código a cada 3-6 meses
- **Se comprometido:** Mude imediatamente

## Proteções Implementadas

1. **Rate Limiting:** 3 tentativas por hora por IP
2. **Timing-Safe Comparison:** Previne timing attacks
3. **Logs de Auditoria:** Todas tentativas são registradas
4. **Sessão Temporária:** Código expira com a sessão
5. **Alertas de Segurança:** Múltiplas tentativas geram alertas

## Como Trocar o Código

1. Acesse Vercel → Settings → Environment Variables
2. Encontre `MASTER_ACCESS_CODE`
3. Clique em **Edit**
4. Digite o novo código
5. Salve e faça redeploy
6. Informe todos os usuários autorizados

## Troubleshooting

**"Sistema de verificação não configurado"**
- A variável `MASTER_ACCESS_CODE` não está configurada no Vercel
- Adicione a variável e faça redeploy

**"Muitas tentativas"**
- Aguarde 1 hora para tentar novamente
- Ou limpe o cache do navegador

**"Código incorreto"**
- Verifique se está digitando o código exato (case-sensitive)
- Confirme o código correto com o administrador

## Monitoramento

Todas as tentativas (corretas e incorretas) são registradas na página **Histórico e Alertas** do dashboard:

- ✅ **access_granted:** Acesso concedido
- ❌ **access_denied:** Código incorreto
- ⚠️ **security_alert:** Múltiplas tentativas falhadas
