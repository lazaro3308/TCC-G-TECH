# Plano de Testes

**Projeto:** G-TECH  
**Documento:** PT-001  
**Versão:** 1.2

## 1. Objetivo

Definir cenários para validar a autenticação, o controle de acesso, a abertura e o acompanhamento de chamados, as atualizações técnicas e a integridade dos dados.

Este documento descreve casos a executar. Um caso listado não deve ser interpretado como aprovado sem evidência de execução registrada.

## 2. Casos de teste da implementação atual

| ID | Cenário | Resultado esperado | Prioridade |
|---|---|---|---|
| CT01 | Acessar `GET /health` | API responde com status `ok` | Alta |
| CT02 | Cadastrar cliente com dados válidos | Conta cliente é criada e sessão iniciada | Alta |
| CT03 | Tentar cadastro com senha menor que 12 caracteres | API rejeita os dados | Alta |
| CT04 | Tentar cadastro com e-mail já utilizado | API informa conflito sem duplicar conta | Alta |
| CT05 | Login com credenciais e perfil corretos | Sessão autenticada estabelecida | Alta |
| CT06 | Login com senha ou perfil incorreto | Acesso negado | Alta |
| CT07 | Consultar `/auth/me` sem sessão | API retorna não autenticado | Alta |
| CT08 | Cliente abrir chamado válido | Chamado criado com protocolo e status inicial | Alta |
| CT09 | Cliente tentar consultar chamados de outra conta | API retorna somente os chamados do próprio cliente | Alta |
| CT10 | Cliente tentar atualizar chamado via PATCH | API nega a operação | Alta |
| CT11 | Técnico consultar `GET /chamados` | Fila de chamados é retornada | Alta |
| CT12 | Técnico atualizar status e resposta | Dados são atualizados e evento é registrado | Alta |
| CT13 | Cliente consultar novamente após atualização técnica | Novo status e resposta aparecem na consulta | Alta |
| CT14 | Encerrar sessão e consultar rota protegida | Sessão deixa de ser aceita | Alta |
| CT15 | Enviar dados inválidos à API | API rejeita a requisição sem gravar dados inválidos | Alta |
| CT16 | Executar build do cliente | Vite conclui a geração dos arquivos de produção | Média |
| CT17 | Técnico atribuir chamado a técnico ativo | Responsável é salvo e evento aparece no histórico | Alta |
| CT18 | Tentar atribuir chamado a usuário cliente/inativo | API rejeita a atribuição sem alterar o chamado | Alta |
| CT19 | Remover responsável de um chamado | Campo fica sem responsável e evento é registrado | Média |
| CT20 | Filtrar fila por status, prioridade e técnico | Somente chamados correspondentes são exibidos | Alta |
| CT21 | Consultar histórico como cliente dono | Eventos do próprio chamado são retornados em ordem cronológica | Alta |
| CT22 | Cliente consultar histórico de chamado alheio | API retorna 404 sem revelar o registro | Alta |
| CT23 | Técnico alterar status | Evento contém status anterior, novo status, autor e data | Alta |
| CT24 | Técnico registrar resposta | Resposta aparece ao cliente e evento é registrado | Alta |
| CT25 | Executar migração em banco existente | Índice é criado sem apagar registros e pode ser executado novamente | Média |

## 3. Recursos ainda não implementados

Os cenários abaixo dependem de funcionalidades futuras e não devem ser considerados disponíveis na versão atual:
- Administração de usuários e categorias.
- Upload e validação de anexos.
- Notificações push, e-mail ou WebSocket.
- Avaliação de atendimento.
- Recuperação de senha e MFA.
- Aplicativo móvel.

## 4. Registro de execução

Ao executar os testes, registrar:
- Identificador do caso.
- Data e ambiente.
- Resultado: aprovado, reprovado ou bloqueado.
- Evidência (log, captura de tela ou resposta HTTP, sem expor segredos ou dados pessoais).
- Defeito encontrado e referência da correção, quando aplicável.

## 5. Critérios de conclusão

- Casos de prioridade alta aprovados antes de qualquer disponibilização pública.
- Falhas corrigidas e submetidas a novo teste.
- Permissões verificadas no servidor para cada perfil.
- Integridade do banco conferida.
- Nenhum segredo, token ou dado pessoal incluído nas evidências versionadas.
