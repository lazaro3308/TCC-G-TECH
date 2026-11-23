# G-TECH
### Sistema de Gestão de Serviços e Chamados de Suporte Técnico

<p align="center">
  <strong>Uma aplicação web para registrar, acompanhar e gerenciar solicitações de suporte técnico.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Projeto-Acad%C3%AAmico-2563EB?style=for-the-badge" alt="Projeto acadêmico">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Node.js-API-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <a href="https://github.com/lazaro3308/TCC-G-TECH/actions/workflows/ci.yml"><img src="https://github.com/lazaro3308/TCC-G-TECH/actions/workflows/ci.yml/badge.svg?branch=main" alt="G-TECH CI"></a>
</p>

O **G-TECH** é um projeto acadêmico de conclusão de curso (TCC) que propõe organizar o fluxo de atendimento de suporte técnico em uma aplicação web. O sistema possui uma área destinada aos clientes e um painel para a equipe técnica, integrados a uma API em Node.js e a um banco de dados MySQL.

A aplicação permite registrar solicitações, acompanhar seu andamento e atualizar os atendimentos pela área técnica. O repositório também reúne documentação de requisitos, arquitetura, modelagem de dados e planejamento de testes.

> **Status:** em desenvolvimento. Este documento separa os recursos implementados daqueles que ainda estão planejados.

---

## Índice

- [Problema e objetivo](#-problema-e-objetivo)
- [Funcionalidades](#-funcionalidades-implementadas)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura-do-projeto)
- [Estrutura](#-estrutura-do-repositório)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração e execução](#-configuração-e-execução)
- [Rotas da API](#-principais-rotas-da-api)
- [Documentação](#-documentação-do-projeto)
- [Estado atual](#-estado-atual-e-próximas-etapas)
- [Segurança](#-segurança)
- [Licença](#-licença)

## 🎯 Problema e objetivo

Solicitações de suporte podem ficar difíceis de acompanhar quando são registradas sem padronização ou sem um histórico centralizado. O G-TECH busca oferecer um fluxo organizado para:

- registrar chamados com informações relevantes;
- permitir que clientes acompanhem suas solicitações;
- oferecer à equipe técnica uma visão centralizada da fila;
- registrar atualizações e respostas dos atendimentos.

## ✨ Funcionalidades implementadas

### Área do cliente

- Cadastro de contas com perfil de cliente.
- Login e encerramento de sessão.
- Abertura de chamados com título, categoria, prioridade e descrição.
- Confirmação de abertura com protocolo.
- Consulta dos próprios chamados e visualização dos detalhes.
- Acompanhamento do status e da resposta técnica.
- Atualização periódica da lista e da tela de confirmação enquanto a página está aberta.

### Cadastro e administração de técnicos

- Solicitação pública de cadastro técnico, sem liberação imediata.
- Aprovação ou recusa por administrador autenticado.
- Criação da conta técnica somente após aprovação.
- Consulta da equipe e ativação/desativação de contas técnicas.
- Primeiro administrador provisionado por script local, sem cadastro público.

### Painel técnico

- Acesso por conta técnica previamente criada.
- Visualização da fila geral de chamados.
- Pesquisa e filtros combináveis por status, prioridade e responsável.
- Atribuição e remoção de técnico responsável, com validação no servidor.
- Atualização do status e registro de resposta técnica.
- Histórico cronológico de abertura, atribuições, alterações e respostas.
- Exibição de indicadores resumidos de atendimento.

### API e proteção de acesso

- Senhas armazenadas com hash bcrypt.
- Sessão JWT em cookie HttpOnly.
- Verificação de perfil e autorização no back-end.
- Consultas MySQL parametrizadas.
- Configuração de Helmet, CORS e limitação de requisições.
- Validação de entradas.
- Histórico transacional de abertura, atribuições, alterações de status e respostas técnicas.
- Autorização para impedir que clientes consultem o histórico de outros clientes.

## 🧰 Tecnologias

| Camada | Tecnologias |
|---|---|
| Front-end | React 19, JavaScript, CSS e Vite |
| Navegação | React Router |
| Componentes e ícones | Lucide React |
| Back-end | Node.js e Express 5 |
| Banco de dados | MySQL |
| Acesso ao banco | mysql2 |
| Autenticação | JWT, bcryptjs e cookie-parser |
| Segurança HTTP | Helmet, CORS e limitação de requisições |
| Versionamento | Git e GitHub |

## 🏗️ Arquitetura do projeto

O sistema está dividido em duas aplicações principais:

1. **Cliente web:** interface React responsável pelas telas de cadastro, autenticação, abertura e consulta de chamados.
2. **API:** aplicação Node.js/Express responsável pelas regras de negócio, autenticação, autorização e comunicação com o MySQL.

O banco de dados mantém os registros necessários para usuários, chamados e histórico de atendimento. A documentação técnica do repositório detalha os fluxos e a modelagem.

## 📁 Estrutura do repositório

```text
TCC-G-TECH/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── styles/
├── server/
│   ├── database/
│   │   └── schema.sql
│   ├── scripts/
│   │   └── criar-tecnico.js
│   ├── index.js
│   └── .env.example
├── docs/
│   └── documentação técnica
├── package.json
├── vite.config.js
└── README.md
```

## 💻 Pré-requisitos

- Node.js (versão LTS recomendada).
- npm.
- MySQL 8 ou compatível.
- Git.
- XAMPP é opcional; pode ser utilizado para iniciar o MySQL e acessar o phpMyAdmin.

## 🚀 Configuração e execução

### 1. Clonar o projeto

```powershell
git clone https://github.com/lazaro3308/TCC-G-TECH.git
cd TCC-G-TECH
```

### 2. Preparar o banco de dados

1. Inicie o serviço MySQL (por exemplo, pelo XAMPP).
2. Abra o phpMyAdmin ou outro cliente MySQL.
3. Importe e execute `server/database/schema.sql`.
4. O script prepara o banco `g_tech_suporte` e as tabelas utilizadas pela aplicação.
5. **Banco já existente:** faça um backup antes de qualquer alteração. Execute, nesta ordem, `server/database/migrations/001_indice_fila_tecnica.sql`, `002_historico_mensagem_texto.sql` e `003_aprovacao_tecnicos.sql`. A terceira migração adiciona o perfil administrativo e a tabela de solicitações, preservando os registros existentes. Não é necessário recriar o banco.

### 3. Configurar a API

No PowerShell:

```powershell
cd server
Copy-Item .env.example .env
```

Edite o arquivo `server/.env` com as credenciais e configurações do seu ambiente. Gere um valor aleatório e exclusivo para `JWT_SECRET`, com pelo menos 32 caracteres.

**Nunca envie o arquivo `.env` ao GitHub.** Não compartilhe credenciais, tokens ou dados pessoais.

Instale as dependências e inicie a API:

```powershell
npm install
npm run dev
```

Por padrão, a API fica disponível em `http://localhost:3000`. Para verificar a disponibilidade, acesse:

```text
http://localhost:3000/health
```

A resposta esperada indica o status `ok`.

### 4. Criar uma conta técnica

Com o banco configurado e a API preparada, abra outro terminal:

```powershell
cd server
npm run create:technician
```

O script solicita nome, e-mail e senha. A senha deve ter pelo menos 12 caracteres. O cadastro público cria contas de cliente; contas técnicas são provisionadas por esse comando.

### 5. Criar o primeiro administrador

Depois de aplicar a migração 003 e configurar a API, execute em outro terminal, dentro de `server`:

```powershell
npm run create:admin
```

O script cria o primeiro administrador e bloqueia novas criações quando já existe um. Consulte [Administração e aprovação de técnicos](docs/ADMINISTRACAO-E-APROVACAO-TECNICOS.md) para o fluxo completo.

### 6. Iniciar o front-end

Em outro terminal, a partir da raiz do projeto:

```powershell
cd client
npm install
npm run dev
```

Acesse o endereço local informado pelo Vite (normalmente `http://localhost:5173`).

Se o Vite utilizar outra porta, ajuste `CLIENT_ORIGIN` no arquivo `server/.env` para corresponder exatamente à origem exibida e reinicie a API.

### 7. Gerar o build do front-end

Na raiz do repositório, com as dependências instaladas:

```powershell
npm run build
```

O comando executa o script de build do cliente.

## 🔌 Principais rotas da API

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/health` | Verificar disponibilidade da API |
| POST | `/auth/register` | Cadastrar cliente |
| POST | `/auth/register-technician` | Solicitar cadastro técnico |
| GET | `/admin/solicitacoes` | Listar solicitações como administrador |
| PATCH | `/admin/solicitacoes/:id` | Aprovar ou recusar solicitação |
| GET | `/admin/tecnicos` | Listar equipe técnica |
| PATCH | `/admin/tecnicos/:id` | Ativar ou desativar técnico |
| POST | `/auth/login` | Autenticar cliente ou técnico |
| POST | `/auth/logout` | Encerrar sessão |
| GET | `/auth/me` | Consultar usuário autenticado |
| POST | `/chamados` | Criar chamado como cliente |
| GET | `/chamados` | Listar chamados conforme o perfil |
| PATCH | `/chamados/:id` | Atualizar status, resposta e responsável como técnico |
| GET | `/tecnico/resumo` | Consultar indicadores do painel técnico |
| GET | `/tecnico/responsaveis` | Listar técnicos ativos para atribuição |
| GET | `/chamados/:id/historico` | Consultar histórico autorizado do chamado |

## 📚 Documentação do projeto

O repositório inclui documentos complementares:

- [Autenticação e painel técnico](docs/AUTENTICACAO-E-PAINEL-TECNICO.md)
- [Administração e aprovação de técnicos](docs/ADMINISTRACAO-E-APROVACAO-TECNICOS.md)
- [Requisitos e regras de negócio](docs/REQUISITOS-E-REGRAS.md)
- [Modelagem de dados](docs/MODELAGEM-DE-DADOS.md)
- [Fluxos e arquitetura](docs/FLUXOS-E-ARQUITETURA.md)
- [Estrutura do projeto](docs/ESTRUTURA-DO-PROJETO.md)
- [Plano de testes](docs/PLANO-DE-TESTES.md)

## 📌 Estado atual e próximas etapas

**Implementado:** autenticação de clientes, técnicos e administradores; solicitação e aprovação de cadastro técnico; gestão de acesso técnico; abertura e consulta de chamados; painel técnico; atribuição de responsáveis; filtros; histórico cronológico; atualização de status e resposta; confirmação de abertura e acompanhamento periódico.

**Planejado ou pendente de evolução:** perfil de funcionários, edição de perfil, anexos, notificações em tempo real, recuperação de senha, autenticação multifator, auditoria ampliada, testes automatizados e aplicativo móvel.

A atualização automática atual utiliza *polling* a cada 15 segundos enquanto a tela está aberta. Isso não equivale a notificações push, e-mail ou comunicação em tempo real por WebSocket.

## 🔐 Segurança

O projeto possui controles básicos de segurança, mas ainda requer revisão e configuração antes de qualquer implantação pública. Para um ambiente de produção, avalie e implemente, entre outros pontos:

- HTTPS e cookies seguros (`COOKIE_SECURE=true`);
- segredo JWT forte, exclusivo e protegido;
- usuário MySQL com privilégios mínimos;
- proteção CSRF adequada ao modelo de autenticação;
- backups, monitoramento e registro de eventos;
- testes de autorização e segurança.

Nunca versione arquivos `.env`, senhas, tokens ou dados pessoais. Use apenas dados fictícios em demonstrações públicas.

## 📄 Licença

Este projeto está distribuído sob os termos da **Apache License 2.0**. Consulte o arquivo [LICENSE](LICENSE) para o texto completo. Bibliotecas, frameworks e demais dependências mantêm suas próprias licenças.

---

<p align="center">
  <strong>G-TECH — organização e acompanhamento do suporte técnico.</strong><br>
  Projeto acadêmico desenvolvido por <a href="https://github.com/lazaro3308">lazaro3308</a>.
</p>
