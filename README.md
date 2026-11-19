# G-TECH

**Sistema de Gestão de Serviços e Chamados de Suporte Técnico**

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-39FF14?style=flat-square)](#estado-atual)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-API-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)\n[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

O **G-TECH** é uma aplicação web para abertura, gerenciamento e acompanhamento de chamados de suporte técnico. O projeto possui uma área para clientes e um painel para a equipe técnica, conectados a uma API Node.js e a um banco de dados MySQL.

> Projeto acadêmico em desenvolvimento. A documentação diferencia funcionalidades já implementadas de recursos previstos para etapas futuras.

## Funcionalidades implementadas

### Área do cliente
- Cadastro público de contas com perfil de cliente.
- Login e encerramento de sessão.
- Abertura de chamados com título, categoria, prioridade e descrição.
- Confirmação após o envio, com protocolo do chamado.
- Consulta dos próprios chamados e visualização de detalhes.
- Acompanhamento de status e resposta técnica.
- Atualização automática da lista de chamados e da tela de confirmação a cada 15 segundos enquanto a página está aberta.

### Painel técnico
- Acesso por conta de técnico criada previamente.
- Visualização da fila geral de chamados.
- Pesquisa e filtro por status.
- Atualização do status do atendimento.
- Registro de resposta técnica.
- Resumo de indicadores de atendimento.

### Segurança e API
- Senhas armazenadas com hash bcrypt.
- Sessão JWT em cookie HttpOnly.
- Verificação de perfil e autorização no back-end.
- Consultas MySQL parametrizadas.
- Helmet, CORS configurado, limitação de requisições e validação de entradas.
- Histórico de alterações dos chamados.

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Front-end web | React 19, JavaScript, CSS, Vite |
| Rotas da interface | React Router |
| Ícones | Lucide React |
| Back-end | Node.js, Express 5 |
| Banco de dados | MySQL |
| Acesso ao banco | mysql2 |
| Autenticação | JWT, bcryptjs e cookie-parser |
| Aplicativo móvel | React Native + Expo — planejado |
| Versionamento | Git e GitHub |

## Identidade visual

| Elemento | Cor |
|---|---|
| Preto | `#050505` |
| Verde principal | `#39FF14` |
| Verde escuro | `#151C18` |

## Estrutura do repositório

```text
G-TECH/
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
├── mobile/                 # etapa futura
├── docs/
│   ├── assets/
│   └── documentação técnica
├── package.json            # atalhos para o Vite
└── README.md
```

## Requisitos para executar

- Node.js (versão LTS recomendada).
- npm.
- MySQL 8 ou compatível.
- Git.
- XAMPP (opcional, pode ser usado para iniciar o MySQL e acessar o phpMyAdmin).

## Configuração do ambiente

### 1. Clonar o projeto

```powershell
git clone https://github.com/lazaro3308/TCC-G-TECH.git
cd TCC-G-TECH
```

### 2. Preparar o banco de dados

1. Inicie o MySQL pelo XAMPP ou pelo serviço instalado na máquina.
2. Abra o phpMyAdmin ou outro cliente MySQL.
3. Importe e execute `server/database/schema.sql`.
4. O script cria o banco `g_tech_suporte` e as tabelas necessárias.

### 3. Configurar e iniciar a API

No PowerShell:

```powershell
cd server
Copy-Item .env.example .env
```

Edite `server/.env` com os dados do seu MySQL. Gere um valor aleatório e exclusivo para `JWT_SECRET`, com pelo menos 32 caracteres. Não compartilhe esse segredo e nunca envie o arquivo `.env` ao GitHub.

Instale as dependências e inicie a API:

```powershell
npm install
npm run dev
```

A API ficará disponível, por padrão, em `http://localhost:3000`. Verifique o funcionamento acessando:

```text
http://localhost:3000/health
```

A resposta esperada é um JSON com o status `ok`.

### 4. Criar uma conta de técnico

Com o banco e o arquivo `.env` configurados, abra outro terminal:

```powershell
cd server
npm run create:technician
```

O comando solicitará nome, e-mail e senha. A senha deve ter pelo menos 12 caracteres. O cadastro público da aplicação cria somente contas de cliente; contas técnicas são provisionadas por esse script.

### 5. Iniciar o front-end

Em outro terminal, na pasta raiz do projeto:

```powershell
cd client
npm install
npm run dev
```

Acesse o endereço local informado pelo Vite (normalmente `http://localhost:5173`).

Se o Vite utilizar outra porta, atualize `CLIENT_ORIGIN` no arquivo `server/.env` para corresponder exatamente ao endereço exibido e reinicie a API.

### 6. Gerar a versão de produção do front-end

Com as dependências do cliente instaladas, na raiz do repositório:

```powershell
npm run build
```

O comando raiz encaminha a execução para o script de build do diretório `client`.

## Principais rotas da API

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/health` | Verificar disponibilidade da API |
| POST | `/auth/register` | Cadastrar cliente |
| POST | `/auth/login` | Autenticar cliente ou técnico |
| POST | `/auth/logout` | Encerrar sessão |
| GET | `/auth/me` | Consultar usuário autenticado |
| POST | `/chamados` | Criar chamado como cliente |
| GET | `/chamados` | Listar chamados conforme o perfil |
| PATCH | `/chamados/:id` | Atualizar chamado como técnico |
| GET | `/tecnico/resumo` | Consultar indicadores do painel técnico |

## Documentação

- [Autenticação e painel técnico](docs/AUTENTICACAO-E-PAINEL-TECNICO.md)
- [Requisitos e regras de negócio](docs/REQUISITOS-E-REGRAS.md)
- [Modelagem de dados](docs/MODELAGEM-DE-DADOS.md)
- [Fluxos e arquitetura](docs/FLUXOS-E-ARQUITETURA.md)
- [Estrutura do projeto](docs/ESTRUTURA-DO-PROJETO.md)
- [Plano de testes](docs/PLANO-DE-TESTES.md)

## Estado atual e próximos passos

**Já implementado:** autenticação de cliente e técnico, abertura e consulta de chamados, painel técnico, atualização de status/resposta, confirmação de abertura e acompanhamento periódico.

**Ainda previsto ou pendente de evolução:** perfis administrativos e de funcionários, atribuição manual de técnicos, edição de perfil, anexos, notificações em tempo real, recuperação de senha, MFA, auditoria ampliada, testes automatizados, aplicativo móvel e preparação completa para produção.

A atualização de acompanhamento utiliza consultas periódicas (polling) a cada 15 segundos enquanto a tela está aberta. Isso não equivale a notificações push, e-mail ou atualização em tempo real por WebSocket.

## Segurança

A implementação atual fornece controles básicos, mas ainda não representa uma certificação ou garantia de segurança para produção. Antes de disponibilizar o sistema publicamente, configure HTTPS, `COOKIE_SECURE=true`, segredo exclusivo e forte, usuário MySQL com privilégios mínimos, proteção CSRF adequada, backups, monitoramento e testes de segurança/autorização.

Nunca versione `.env`, senhas, tokens ou dados pessoais.

## Licença

Este projeto é distribuído sob os termos da **Apache License 2.0**. Consulte o arquivo [LICENSE](LICENSE) para ver o texto completo da licença.\n\nA licença se aplica ao código deste repositório, respeitando avisos de copyright e licenças de terceiros. Bibliotecas, frameworks, ícones e demais dependências mantêm suas próprias licenças.
