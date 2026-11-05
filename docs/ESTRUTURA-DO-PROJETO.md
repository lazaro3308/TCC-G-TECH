# Estrutura do Projeto e Organização do Código

**Projeto:** G-TECH  
**Documento:** EC-001  
**Versão:** 1.0

## 1. Estrutura de diretórios

```text
G-TECH/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── mobile/
├── database/
│   └── gtech.sql
├── docs/
│   ├── assets/
│   ├── REQUISITOS-E-REGRAS.md
│   ├── MODELAGEM-DE-DADOS.md
│   ├── FLUXOS-E-ARQUITETURA.md
│   ├── ESTRUTURA-DO-PROJETO.md
│   └── PLANO-DE-TESTES.md
├── .gitignore
└── README.md
```

## 2. Responsabilidade dos diretórios

### `client/`
Contém a aplicação React para navegadores.
- `components/`: componentes reutilizáveis.
- `pages/`: páginas e áreas do sistema.
- `services/`: comunicação HTTP com a API.
- `styles/`: estilos globais e específicos.
- `assets/`: imagens, ícones e demais recursos visuais.

### `server/`
Contém a API Node.js, sem Express.
- `config/`: configuração de ambiente e banco de dados.
- `routes/`: associação entre método HTTP, caminho e controller.
- `controllers/`: tratamento de requisições e respostas.
- `services/`: regras de negócio e validações de domínio.
- `repositories/`: acesso ao banco e consultas SQL parametrizadas.
- `middlewares/`: autenticação, autorização e tratamento transversal.
- `utils/`: funções auxiliares.

### `database/`
Scripts de criação e evolução do banco de dados.

### `mobile/`
Diretório reservado ao aplicativo React Native com Expo, previsto para etapa posterior.

### `docs/`
Documentação funcional, técnica, diagramas e materiais visuais.

## 3. Padrão de comunicação entre camadas

O cliente web e o aplicativo móvel deverão consumir a API por HTTP, utilizando JSON. Controllers não deverão concentrar regras de negócio ou consultas SQL. Os serviços coordenarão as regras e os repositórios serão responsáveis pelo acesso aos dados.

## 4. Convenções de código

- Utilizar nomes descritivos e consistentes.
- Manter um módulo por responsabilidade.
- Evitar duplicação de regras de negócio.
- Validar entradas recebidas pela API.
- Utilizar consultas parametrizadas.
- Centralizar configurações sensíveis em variáveis de ambiente.
- Registrar alterações estruturais do banco em scripts versionados.
