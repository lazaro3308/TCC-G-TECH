# Autenticação e painel técnico — G-TECH

**Versão:** 1.2  
**Situação:** documentação da implementação atual.

## 1. Perfis disponíveis

- **Cliente:** cria a própria conta pelo cadastro público, abre chamados e consulta somente os próprios registros.
- **Técnico:** acessa com conta provisionada previamente, consulta a fila de chamados e atualiza status e resposta técnica.

O cadastro público sempre cria o perfil `cliente`. Não há opção para o usuário elevar o próprio perfil. Perfis de administrador e funcionário ainda fazem parte do planejamento, não da autenticação atualmente implementada.

## 2. Preparar o banco

1. Inicie o MySQL pelo XAMPP.
2. Abra o phpMyAdmin.
3. Importe `server/database/schema.sql`.
4. Confirme a criação do banco `g_tech_suporte` e das tabelas `usuarios`, `chamados` e `historico_chamados`.

## 3. Configurar variáveis de ambiente

Na pasta `server`:

```powershell
Copy-Item .env.example .env
```

Configure as variáveis no arquivo `.env`:

| Variável | Finalidade |
|---|---|
| `PORT` | Porta da API (padrão 3000) |
| `NODE_ENV` | Ambiente de execução |
| `DB_HOST`, `DB_PORT` | Endereço e porta do MySQL |
| `DB_USER`, `DB_PASSWORD` | Credenciais do banco |
| `DB_NAME` | Banco `g_tech_suporte` |
| `JWT_SECRET` | Segredo aleatório com pelo menos 32 caracteres |
| `CLIENT_ORIGIN` | Origem exata do front-end |
| `COOKIE_SECURE` | Ativa cookie Secure quando aplicável |

Não publique o arquivo `.env`, não envie seu conteúdo em conversas e não reutilize o segredo em outros projetos.

## 4. Instalar e iniciar a API

```powershell
cd server
npm install
npm run dev
```

A API inicia em `http://localhost:3000`. A rota `GET /health` verifica a disponibilidade.

## 5. Criar uma conta técnica

Com o banco e as variáveis configurados:

```powershell
cd server
npm run create:technician
```

O script solicita nome, e-mail e senha (mínimo de 12 caracteres), gera o hash com bcrypt e cria uma conta com perfil `tecnico`. Não existe senha padrão no repositório.

## 6. Iniciar o front-end

Em outro terminal:

```powershell
cd client
npm install
npm run dev
```

Se o Vite escolher uma porta diferente de 5173, atualize `CLIENT_ORIGIN` no `server/.env` para a origem exata exibida pelo Vite e reinicie a API.

## 7. Rotas disponíveis

| Método | Rota | Acesso / finalidade |
|---|---|---|
| GET | `/health` | Público — verificação da API |
| POST | `/auth/register` | Público — cria somente cliente |
| POST | `/auth/login` | Público — autentica conforme perfil informado |
| POST | `/auth/logout` | Encerra a sessão |
| GET | `/auth/me` | Sessão autenticada |
| POST | `/chamados` | Cliente — abre chamado |
| GET | `/chamados` | Cliente — próprios chamados; técnico — fila geral |
| PATCH | `/chamados/:id` | Técnico — atualiza status, resposta e responsável |
| GET | `/tecnico/resumo` | Técnico — indicadores |
| GET | `/tecnico/responsaveis` | Técnico — lista de técnicos ativos para atribuição |
| GET | `/chamados/:id/historico` | Cliente dono do chamado ou técnico — histórico do atendimento |

## 8. Gestão, atribuição e histórico

No painel técnico, a equipe pode atribuir ou remover o responsável de um chamado, alterar o status e registrar uma resposta ao cliente. Os filtros permitem combinar status, prioridade e responsável, incluindo chamados ainda sem atribuição. A API valida que o responsável selecionado seja uma conta técnica ativa.

O endpoint de histórico retorna eventos em ordem cronológica. Clientes só podem consultar o histórico dos próprios chamados; técnicos autenticados podem consultar a fila. A abertura, alteração de status, atribuição e resposta são registradas na mesma transação da atualização correspondente.

## 9. Fluxo de acompanhamento

Após criar um chamado, o cliente é direcionado à tela de confirmação, que apresenta o protocolo e o estado atual. A aplicação consulta a API periodicamente, a cada 15 segundos, enquanto a tela/lista está aberta. O cliente também pode abrir os detalhes do chamado para consultar a resposta técnica.

Os status atualmente utilizados pelo banco e pela interface são:

- `Aguardando atendimento`
- `Em atendimento`
- `Aguardando cliente`
- `Resolvido`
- `Cancelado`

O polling não é uma notificação push nem uma conexão em tempo real. A atualização depende da página permanecer aberta e conseguir consultar a API.

## 10. Controles implementados

- Hash de senha com bcryptjs (12 rounds).
- JWT armazenado em cookie `HttpOnly`, com `SameSite=Lax` e opção `Secure` em produção.
- Verificação de perfil no servidor.
- Consultas SQL parametrizadas.
- Helmet e CORS com origem configurada.
- Limitação de requisições e limite de payload JSON.
- Validação de dados no servidor.
- Registro de abertura e alterações de status/resposta no histórico.
- Variáveis sensíveis mantidas fora do versionamento.

## 11. Pendências antes de produção

A implementação é uma base de segurança, não uma garantia de segurança extrema ou certificação. Antes de expor o sistema à internet, configure HTTPS e `COOKIE_SECURE=true`, segredo forte exclusivo do ambiente, usuário MySQL com privilégios mínimos, backups, monitoramento e testes de autorização/CSRF.

Também devem ser planejados MFA para técnicos, revogação de sessões no servidor, recuperação segura de senha, trilha de auditoria ampliada e testes automatizados. A proteção de origem atualmente existente é uma mitigação básica e não substitui uma estratégia CSRF completa.
