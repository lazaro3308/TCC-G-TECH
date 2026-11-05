# G-TECH

**Sistema de Gestão de Serviços e Chamados de Suporte Técnico**

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-39FF14?style=flat-square)](#)
[![Node.js](https://img.shields.io/badge/Node.js-API-339933?style=flat-square&logo=node.js&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-Web-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql&logoColor=white)](#)

O **G-TECH** é uma plataforma destinada ao gerenciamento de solicitações de suporte técnico. O sistema prevê ambientes específicos para administradores, funcionários, técnicos e clientes, permitindo registrar, acompanhar, atribuir e avaliar chamados.

## Identidade visual

| Elemento | Valor |
|---|---|
| Preto | `#050505` |
| Verde principal | `#39FF14` |
| Verde escuro | `#151C18` |

A prancha visual conceitual está disponível em [`docs/assets/identidade-visual-conceitual.png`](docs/assets/identidade-visual-conceitual.png).

## Tecnologias

- **Front-end web:** React, JavaScript e CSS.
- **Back-end:** Node.js, utilizando o módulo HTTP nativo (`node:http`), sem Express.
- **Banco de dados:** MySQL 8 ou superior.
- **Aplicativo móvel (etapa futura):** React Native com Expo.
- **Versionamento:** Git e GitHub.

> O projeto não utiliza Express nem XAMPP. O MySQL deverá ser instalado e executado como serviço independente.

## Estrutura do repositório

```text
G-TECH/
├── client/                 # Aplicação web React
├── server/                 # API Node.js
├── mobile/                 # Aplicativo React Native/Expo (etapa futura)
├── database/               # Scripts SQL e estrutura do banco
├── docs/                   # Requisitos, diagramas e documentação
├── .gitignore
└── README.md
```

A estrutura detalhada está descrita em [`docs/ESTRUTURA-DO-PROJETO.md`](docs/ESTRUTURA-DO-PROJETO.md).

## Documentação

- [Especificação de requisitos e regras de negócio](docs/REQUISITOS-E-REGRAS.md)
- [Modelagem de dados: DER, modelo lógico e dicionário](docs/MODELAGEM-DE-DADOS.md)
- [Fluxos do sistema e arquitetura](docs/FLUXOS-E-ARQUITETURA.md)
- [Estrutura do código](docs/ESTRUTURA-DO-PROJETO.md)
- [Plano de testes](docs/PLANO-DE-TESTES.md)

## Configuração inicial

### Requisitos de ambiente

- Node.js em versão LTS.
- npm.
- MySQL Server 8.0 ou superior.
- Git.

### Banco de dados

1. Inicie o serviço MySQL.
2. Abra MySQL Workbench, DBeaver ou o terminal MySQL.
3. Execute o script [`database/gtech.sql`](database/gtech.sql).
4. Confirme a criação do banco `gtech` e das tabelas.

### API

No PowerShell:

```powershell
cd server
Copy-Item .env.example .env
npm.cmd install
npm.cmd run dev
```

A rota inicial de verificação estará disponível em `http://localhost:3000/api/health`.

### Aplicação web

Em outro terminal PowerShell:

```powershell
cd client
npm.cmd install
npm.cmd run dev
```

Utilize o endereço local informado pelo Vite.

## Segurança e configuração

- Não versionar arquivos `.env`, credenciais, tokens ou dados pessoais.
- Senhas deverão ser armazenadas exclusivamente como hashes seguros.
- Toda autorização deverá ser verificada no servidor.
- Consultas ao banco deverão utilizar parâmetros.
- Não disponibilizar o serviço MySQL diretamente à internet.

## Estado do desenvolvimento

O repositório contém a documentação inicial, o script de criação do banco e a estrutura-base dos projetos web e servidor. A implementação das funcionalidades será realizada de forma incremental, com validação e testes a cada etapa.

## Licença

A licença do projeto deverá ser definida pelos responsáveis antes da publicação de uma versão distribuível.
