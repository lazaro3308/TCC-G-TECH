# Plano de Testes

**Projeto:** G-TECH  
**Documento:** PT-001  
**Versão:** 1.0

## 1. Objetivo

Definir cenários mínimos para validar autenticação, permissões, fluxo de chamados, integridade dos dados e segurança básica.

## 2. Casos de teste

| ID | Cenário | Resultado esperado | Prioridade |
|---|---|---|---|
| CT01 | Autenticação com credenciais válidas | Sessão estabelecida | Alta |
| CT02 | Autenticação com senha incorreta | Acesso negado com mensagem genérica | Alta |
| CT03 | Autenticação de usuário inativo | Acesso negado | Alta |
| CT04 | Cliente consulta chamado de outro cliente | Acesso negado ou recurso não encontrado | Alta |
| CT05 | Cliente registra chamado válido | Chamado criado com status ABERTO | Alta |
| CT06 | Registro de chamado com categoria inexistente | Validação impede a operação | Alta |
| CT07 | Funcionário atribui técnico | Responsável atualizado e histórico registrado | Alta |
| CT08 | Técnico consulta chamado não atribuído a ele | Acesso negado | Alta |
| CT09 | Usuário autorizado altera status | Histórico registra a transição | Alta |
| CT10 | Cliente tenta avaliar chamado ainda aberto | Operação recusada | Média |
| CT11 | Cliente tenta avaliar o mesmo chamado novamente | Operação recusada | Média |
| CT12 | Envio de anexo não permitido | Arquivo recusado | Alta |
| CT13 | Usuário consulta notificações próprias | Apenas notificações autorizadas são retornadas | Média |
| CT14 | Usuário tenta alterar notificação de outro usuário | Acesso negado | Alta |
| CT15 | Entrada com caracteres especiais em campos | Dados tratados sem execução de SQL indevido | Alta |

## 3. Critérios de conclusão

- Todos os casos de prioridade alta deverão ser aprovados antes da disponibilização pública.
- Falhas deverão ser registradas, corrigidas e testadas novamente.
- Testes de autorização deverão ser executados para cada perfil.
- Testes de banco deverão verificar chaves estrangeiras e restrições.
