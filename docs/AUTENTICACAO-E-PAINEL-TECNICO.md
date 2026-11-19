# Autenticação e painel técnico — G-TECH

## Perfis

- **Cliente:** cria a própria conta, abre chamados e consulta somente os próprios registros.
- **Técnico:** entra por conta provisionada previamente; consulta a fila geral e atualiza status/resposta dos chamados.
- O cadastro público sempre cria perfil `cliente`. Não existe opção de elevar o próprio perfil.

## Preparar o banco

1. Inicie MySQL pelo XAMPP.
2. Abra phpMyAdmin e importe `server/database/schema.sql`.
3. Copie `server/.env.example` para `server/.env`.
4. Preencha conexão MySQL e gere um segredo JWT aleatório com pelo menos 32 caracteres. Não envie `.env) ao GitHub.

## Instalar e iniciar a API

No terminal:

```powershell
cd server
npm install
npm run dev
```

A API inicia em `http://localhost:3000`. A rota `/health` verifica disponibilidade.

## Criar o primeiro técnico

Com banco e variáveis configurados:

```powershell
cd server
npm run create:technician
```

O script solicita nome, e-mail e senha (mínimo 12 caracteres), gera hash com bcrypt e grava o perfil `tecnico`. Não há senha padrão no repositório.

## Iniciar o frontend

Em outro terminal:

```powershell
cd client
npm install
npm run dev
```

Se o Vite escolher uma porta diferente de 5173, atualize `CLIENT_ORIGIN` no `server/.env` para a origem exata exibida pelo Vite e reinicie a API.

## Rotas principais

| Método | Rota | Acesso |
|---|---|---|
| POST | `/auth/register` | Público — cria somente cliente |
| POST | `/auth/login` | Público — exige perfil selecionado |
| POST | `/auth/logout` | Sessão |
| GET | `/auth/me` | Sessão |
| POST | `/chamados` | Cliente |
| GET | `/chamados` | Cliente (próprios) ou técnico (fila) |
| PATCH | `/chamados/:id` | Técnico |
| GET | `/tecnico/resumo` | Técnico |

## Controles implementados

- Senhas armazenadas com bcrypt (12 rounds).
- Sessão JWT em cookie `HttpOnly`, `SameSite=Lax` e `Secure` em produção.
- Verificação de perfil no servidor, não apenas na interface.
- Consultas SQL parametrizadas.
- Helmet, CORS com origem configurada, limite de requisições e limite de payload.
- Validação de dados no servidor.
- Histórico de alterações de status/resposta.
- Variáveis sensíveis fora do versionamento.

## Antes de publicar em produção

A implementação é uma base de segurança, não uma garantia de “segurança extrema”. Antes de expor à internet, configure HTTPS e `COOKIE_SECURE=true`, segredo forte exclusivo do ambiente, usuário MySQL com privilégios mínimos, backup, monitoramento e testes de autorização/CSRF. Planeje MFA para técnicos, revogação de sessões no servidor, recuperação segura de senha, trilha de auditoria ampliada e testes automatizados. Não reutilize senhas de demonstração.
