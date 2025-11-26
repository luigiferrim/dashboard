# Guia de Segurança - Coxilha Coffee

## Medidas de Segurança Implementadas

### 1. Autenticação e Senhas
- **Hash PBKDF2 com Salt**: Senhas são hasheadas usando PBKDF2 com 100.000 iterações e salt aleatório
- **Validação de Senha Forte**: Requisitos mínimos:
  - Mínimo 8 caracteres
  - Pelo menos 1 maiúscula
  - Pelo menos 1 minúscula
  - Pelo menos 1 número
  - Pelo menos 1 caractere especial
- **Comparação Timing-Safe**: Previne ataques de timing

### 2. Rate Limiting
- **Registro**: 5 tentativas por IP a cada 15 minutos
- **Login**: Protegido pelo NextAuth (rate limiting automático)
- **Criação de Lotes**: 30 lotes por usuário a cada 5 minutos
- **Troca de Senha**: 5 tentativas por usuário a cada 15 minutos

### 3. Proteção contra Injeção
- **SQL Injection**: Todas as queries usam prepared statements parametrizados
- **XSS**: Inputs são sanitizados antes de armazenar no banco
- **Validação de Tipos**: Números e emails são validados antes de processar

### 4. Headers de Segurança HTTP
- `X-Frame-Options: DENY` - Previne clickjacking
- `X-Content-Type-Options: nosniff` - Previne MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controla informações de referência
- `Content-Security-Policy` - Previne XSS e injeção de código
- `Permissions-Policy` - Desabilita APIs perigosas

### 5. Sanitização de Dados
- Strings são limpas de caracteres perigosos (< >)
- Emails são validados e normalizados
- Números são validados antes de processar
- Tamanhos máximos são aplicados

### 6. Logs de Auditoria
- Todas as ações são registradas (criar, editar, deletar lotes)
- Logins são registrados
- Trocas de senha são registradas
- IDs de usuários são associados a cada ação

### 7. Proteção de Sessão
- Sessões JWT com expiração de 7 dias
- Secret forte obrigatório via variável de ambiente
- Middleware protege todas as rotas internas

### 8. Boas Práticas
- Erros não expõem detalhes sensíveis em produção
- Mensagens genéricas para evitar enumeração de usuários
- Validação estrita de inputs (whitelist)
- Logs não expõem senhas ou dados sensíveis

## Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] Configurar `NEXTAUTH_SECRET` forte (min 32 caracteres aleatórios)
- [ ] Garantir que `DATABASE_URL` está seguro e não exposto
- [ ] Revisar permissões do banco de dados
- [ ] Ativar SSL/TLS no banco Neon
- [ ] Configurar HTTPS no domínio
- [ ] Revisar logs de auditoria periodicamente
- [ ] Implementar backup automático do banco
- [ ] Monitorar tentativas de login falhadas
- [ ] Configurar alertas para atividades suspeitas

## Recomendações Futuras

1. **Autenticação de Dois Fatores (2FA)**: Adicionar camada extra de segurança
2. **OAuth**: Permitir login com Google/Microsoft
3. **Captcha**: Adicionar em formulários de registro/login
4. **IP Whitelist**: Para ambientes corporativos
5. **Auditoria Externa**: Realizar pentest profissional
6. **WAF**: Considerar Web Application Firewall
7. **Monitoramento**: Implementar Sentry ou similar para erros
8. **Backup Automático**: Configurar backups diários do Neon

## Contato

Em caso de vulnerabilidade descoberta, não exponha publicamente.
Entre em contato diretamente com o administrador do sistema.
