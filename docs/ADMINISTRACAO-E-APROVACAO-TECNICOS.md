# Administração e aprovação de técnicos

## Fluxo de cadastro

1. Na tela inicial, selecione **Sou técnico** e escolha **Solicitar cadastro**.
2. Informe nome, e-mail, senha e, opcionalmente, telefone.
3. A API armazena a solicitação com status `pendente`. Nenhuma sessão é criada.
4. Um administrador autenticado consulta as solicitações em `/admin`.
5. Ao aprovar, a API cria a conta com perfil `tecnico` dentro de uma transação e marca a solicitação como aprovada.
6. Após a aprovação, o técnico pode entrar selecionando **Sou técnico**.
7. O administrador pode recusar solicitações, consultar o histórico de decisões e ativar/desativar contas técnicas.

A autorização é verificada no servidor. Uma conta pendente não existe na tabela de usuários e não pode autenticar. Contas desativadas são bloqueadas nas requisições autenticadas seguintes.

## Preparar banco existente

Faça um backup do banco antes de aplicar alterações. Com o banco `g_tech_suporte` selecionado, execute uma única vez:

```sql
-- server/database/migrations/003_aprovacao_tecnicos.sql
```

A migração amplia o ENUM de perfil para aceitar `admin` e cria `solicitacoes_tecnicos`. Ela não apaga clientes, técnicos ou chamados existentes.

Para instalações novas, utilize o `server/database/schema.sql` atualizado.

## Criar o primeiro administrador

1. Configure `server/.env` com os dados corretos do MySQL e um `JWT_SECRET` forte.
2. No terminal, dentro de `server`, execute:

```powershell
npm run create:admin
```

3. Informe nome, e-mail e senha (mínimo de 12 caracteres).
4. Na tela de login, selecione **Sou administrador**.

O script permite criar o primeiro administrador apenas quando ainda não existe nenhum perfil administrativo. Não existe cadastro público de administradores. Guarde as credenciais com segurança.

## Rotas administrativas

| Método | Rota | Acesso |
|---|---|---|
| GET | `/admin/solicitacoes?status=pendente` | Administrador |
| PATCH | `/admin/solicitacoes/:id` | Administrador |
| GET | `/admin/tecnicos` | Administrador |
| PATCH | `/admin/tecnicos/:id` | Administrador |

A decisão aceita `aprovar` ou `recusar`. A recusa pode conter um motivo opcional de até 500 caracteres. A alteração de acesso de técnico recebe `{ "ativo": true }` ou `{ "ativo": false }`.

## Cuidados

- Nunca compartilhe o arquivo `.env`, senhas ou hashes.
- Não crie manualmente administradores diretamente pela interface pública.
- Faça backup antes de executar migrações em banco com dados reais.
- Teste o fluxo com contas fictícias antes de utilizar em ambiente de produção.
