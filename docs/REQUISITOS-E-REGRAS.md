# Especificação de Requisitos e Regras de Negócio

**Projeto:** G-TECH  
**Documento:** ER-RN-001  
**Versão:** 1.0  
**Data:** 05/11/2026  
**Status:** Especificação inicial

## 1. Introdução

Este documento estabelece os requisitos funcionais, os requisitos não funcionais, as regras de negócio e os limites iniciais do sistema G-TECH.

## 2. Objetivo do sistema

Desenvolver uma plataforma para registrar e gerenciar solicitações de suporte técnico, permitindo que clientes acompanhem seus atendimentos e que a equipe responsável realize triagem, atribuição, execução e encerramento dos chamados.

## 3. Perfis de acesso

| Perfil | Responsabilidades previstas |
|---|---|
| Administrador | Gerenciar usuários, categorias, permissões, configurações e indicadores. |
| Funcionário | Consultar a fila de atendimento, realizar triagem e atribuir técnicos. |
| Técnico | Consultar chamados atribuídos, registrar atividades e informar soluções. |
| Cliente | Registrar solicitações, acompanhar chamados e avaliar o atendimento. |

## 4. Escopo

### 4.1 Funcionalidades incluídas
- Autenticação e controle de acesso por perfil.
- Gerenciamento de usuários e categorias.
- Abertura e acompanhamento de chamados.
- Triagem e atribuição de técnicos.
- Atualização de status e registro de solução.
- Comentários, anexos e histórico.
- Notificações internas.
- Avaliação de atendimento.
- Indicadores administrativos básicos.

### 4.2 Funcionalidades não contempladas na primeira versão
- Integração com WhatsApp ou serviços externos de mensagens.
- Chat em tempo real.
- Cobranças e pagamentos.
- Aplicativo móvel em produção.
- Gestão de estoque e faturamento.

## 5. Requisitos funcionais

| Identificador | Descrição | Prioridade |
|---|---|---|
| RF01 | O sistema deverá permitir autenticação de usuários por credenciais. | Alta |
| RF02 | O sistema deverá permitir encerramento de sessão. | Alta |
| RF03 | O sistema deverá identificar o perfil do usuário autenticado. | Alta |
| RF04 | O administrador deverá cadastrar, consultar, atualizar e desativar usuários. | Alta |
| RF05 | O administrador deverá gerenciar categorias de chamados. | Alta |
| RF06 | O cliente deverá abrir chamados com título, descrição e categoria. | Alta |
| RF07 | O cliente deverá consultar exclusivamente os próprios chamados. | Alta |
| RF08 | O funcionário deverá realizar a triagem dos chamados autorizados. | Alta |
| RF09 | O funcionário ou administrador deverá atribuir chamados a técnicos. | Alta |
| RF10 | O técnico deverá consultar os chamados atribuídos a ele. | Alta |
| RF11 | O técnico deverá registrar o andamento e a solução do atendimento. | Alta |
| RF12 | Usuários autorizados deverão adicionar comentários aos chamados. | Média |
| RF13 | O sistema deverá registrar alterações relevantes no histórico. | Alta |
| RF14 | O sistema deverá permitir anexos com validação de formato e tamanho. | Média |
| RF15 | O sistema deverá gerar notificações internas sobre eventos relevantes. | Média |
| RF16 | O cliente deverá avaliar um chamado após sua resolução ou encerramento. | Média |
| RF17 | O administrador deverá consultar indicadores básicos de atendimento. | Média |
| RF18 | O sistema deverá disponibilizar filtros conforme o perfil de acesso. | Média |

## 6. Requisitos não funcionais

| Identificador | Descrição |
|---|---|
| RNF01 | Senhas deverão ser armazenadas com algoritmo de hash apropriado, como Argon2id ou bcrypt. |
| RNF02 | Autenticação e autorização deverão ser verificadas no servidor. |
| RNF03 | A implantação em produção deverá utilizar HTTPS. |
| RNF04 | Consultas SQL deverão utilizar parâmetros, evitando concatenação insegura de valores. |
| RNF05 | A interface deverá adaptar-se a dispositivos desktop, tablet e celular. |
| RNF06 | O código deverá ser modular, padronizado e versionado. |
| RNF07 | Mensagens de erro não deverão expor credenciais ou detalhes internos. |
| RNF08 | Dados deverão ser validados no cliente e no servidor. |
| RNF09 | O banco deverá utilizar chaves primárias, estrangeiras e restrições de integridade. |
| RNF10 | O repositório deverá possuir instruções de instalação e execução. |
| RNF11 | Operações relevantes deverão possuir registros para auditoria. |
| RNF12 | Arquivos enviados deverão ser validados quanto a tamanho, extensão e tipo de conteúdo. |

## 7. Regras de negócio

- RN01: somente usuários ativos poderão autenticar-se.
- RN02: o cadastro público, quando habilitado, deverá criar exclusivamente usuários com perfil CLIENTE.
- RN03: somente administradores poderão criar outros administradores ou alterar perfis privilegiados.
- RN04: clientes poderão acessar somente chamados vinculados ao próprio cadastro.
- RN05: técnicos poderão acessar os chamados atribuídos a eles, respeitadas as permissões administrativas.
- RN06: todo chamado deverá ser criado com status ABERTO.
- RN07: os estados previstos são ABERTO, EM_TRIAGEM, ATRIBUIDO, EM_ATENDIMENTO, AGUARDANDO_CLIENTE, RESOLVIDO, FECHADO e CANCELADO.
- RN08: alterações de status e atribuição deverão gerar registros no histórico.
- RN09: avaliações somente poderão ser registradas após a resolução ou o encerramento do chamado.
- RN10: cada chamado poderá possuir, no máximo, uma avaliação.
- RN11: comentários e registros de histórico deverão ser armazenados separadamente.
- RN12: registros com histórico associado deverão ser desativados ou arquivados, evitando exclusão indevida.
- RN13: datas deverão ser armazenadas em UTC e convertidas para o fuso horário de apresentação.
- RN14: anexos deverão respeitar limites configuráveis e não poderão ser arquivos executáveis.
- RN15: a autorização deverá ser aplicada no back-end, independentemente dos controles exibidos na interface.

## 8. Critérios gerais de aceite

A primeira versão será considerada funcional quando os perfis previstos conseguirem executar suas operações autorizadas, os chamados percorrerem o fluxo definido, as alterações forem registradas e os testes essenciais forem aprovados.
