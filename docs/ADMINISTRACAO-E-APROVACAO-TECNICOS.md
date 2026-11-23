# Cadastro e administração de técnicos

## Cadastro e primeiro acesso

1. Na tela inicial, selecione **Sou técnico**.
2. Escolha **Criar conta técnica**.
3. Informe nome, e-mail, senha e, opcionalmente, telefone.
4. Após o cadastro, a API cria uma conta ativa com perfil `tecnico`, inicia a sessão e encaminha o usuário ao painel técnico.
5. Nos próximos acessos, selecione **Sou técnico** e entre com e-mail e senha.

Não existe etapa de aprovação administrativa para novos técnicos. A API define o perfil no servidor; o navegador não pode escolher ou alterar o perfil de uma conta já cadastrada.

## Administração de acessos

O painel administrativo continua disponível para operações internas, como consultar técnicos e ativar ou desativar contas. Ele não é necessário para liberar novos cadastros.

A autenticação é verificada no servidor em cada requisição. Contas desativadas são bloqueadas nas requisições autenticadas seguintes. Não existe cadastro público de administradores; o primeiro administrador é provisionado pelo script local.

## Banco de dados existente

O cadastro direto utiliza a tabela `usuarios` já existente e não exige apagar, recriar ou alterar os registros de clientes e chamados. A tabela histórica `solicitacoes_tecnicos`, criada pela migração 003, pode permanecer no banco sem interferir no novo fluxo. Se houver solicitações pendentes antigas que devam ser convertidas em contas ativas, faça backup e execute uma vez `server/database/migrations/004_ativar_solicitacoes_tecnicos.sql` após a migração 003. A migração não sobrescreve contas existentes; solicitações cujo e-mail já pertença a um cliente permanecem sem conversão.

Para instalações novas, utilize `server/database/schema.sql`. Para bancos existentes, faça backup antes de aplicar qualquer migração pendente, seguindo a ordem documentada no README.

## Criar o primeiro administrador (opcional)

1. Configure `server/.env` com os dados corretos do MySQL e um `JWT_SECRET` forte.
2. No terminal, dentro de `server`, execute:

```powershell
npm run create:admin
```

3. Informe nome, e-mail e senha (mínimo de 12 caracteres).
4. Na tela de login, selecione **Sou administrador**.

O script permite criar o primeiro administrador apenas quando ainda não existe nenhum perfil administrativo. Não existe cadastro público de administradores.

## Gerenciar técnicos

| Método | Rota | Acesso |
|---|---|---|
| GET | `/admin/tecnicos` | Administrador |
| PATCH | `/admin/tecnicos/:id` | Administrador |

A alteração de acesso recebe `{ "ativo": true }` ou `{ "ativo": false }`.

## Cuidados

- Nunca compartilhe o arquivo `.env`, senhas ou hashes.
- Faça backup antes de executar migrações em bancos com dados.
- Teste os fluxos com contas fictícias antes de utilizar em ambiente de produção.
