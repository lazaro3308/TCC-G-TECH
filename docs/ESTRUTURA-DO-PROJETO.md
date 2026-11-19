# Estrutura do Projeto e Organização do Código

**Projeto:** G-TECH  
**Documento:** EC-001  
**Versão:** 1.1

## 1. Estrutura atual do repositório

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
│   ├── database/
│   │   └── schema.sql
│   ├── scripts/
│   │   └── criar-tecnico.js
│   ├── index.js
│   ├── .env.example
│   └── package.json
├── mobile/                 # reservado para etapa futura
├── docs/
│   ├── assets/
│   ├── AUTENTICACAO-E-PAINEL-TECNICO.md
│   ├── REQUISITOS-E-REGRAS.md
│   ├── MODELAGEM-DE-DADOS.md
│   ├── FLUXOS-E-ARQUITETURA.md
│   ├── ESTRUTURA-DO-PROJETO.md
│   └── PLANO-DE-TESTES.md
├── package.json            # atalhos para scripts do client
└── README.md
```

## 2. Responsabilidade dos diretórios

### `client/`
Aplicação web React executada pelo Vite.
- `components/`: elementos reutilizáveis, como navegação e componentes de interface.
- `pages/`: páginas da área do cliente e do painel técnico.
- `services/`: comunicação HTTP com a API e funções de sessão.
- `styles/`: estilos globais e específicos.
- `assets/`: imagens, ícones e demais recursos visuais.

### `server/`
API Node.js com Express.
- `index.js`: inicialização do Express, middlewares, autenticação, rotas e acesso aos dados.
- `database/schema.sql`: criação do banco e das tabelas.
- `scripts/criar-tecnico.js`: criação administrativa de contas técnicas.
- `.env.example`: modelo das variáveis necessárias para execução.

A API está atualmente concentrada em `index.js`. A separação futura em rotas, controllers, serviços e repositórios poderá ocorrer conforme o projeto crescer; essas pastas não devem ser consideradas implementadas neste momento.

### `mobile/`
Diretório reservado ao aplicativo React Native com Expo. O aplicativo ainda não faz parte da versão funcional documentada.

### `docs/`
Requisitos, regras de negócio, modelagem, arquitetura, instruções técnicas e plano de testes.

## 3. Comunicação entre camadas

O navegador consome a API por HTTP, enviando e recebendo JSON. A API valida os dados, verifica a sessão e o perfil do usuário e executa consultas parametrizadas no MySQL. O cookie de sessão é enviado pelo navegador nas requisições autenticadas.

## 4. Scripts npm

Na raiz, os scripts delegam ao projeto web:

| Comando | Ação |
|---|---|
| `npm run dev` | Inicia o Vite do diretório `client` |
| `npm run build` | Gera o build de produção do cliente |
| `npm run preview` | Pré-visualiza o build do cliente |

Na pasta `server`:

| Comando | Ação |
|---|---|
| `npm run dev` | Inicia a API com reinicialização ao detectar alterações |
| `npm start` | Inicia a API |
| `npm run create:technician` | Executa o cadastro de uma conta técnica |

## 5. Convenções

- Manter nomes descritivos e consistentes.
- Separar componentes visuais e acesso à API.
- Validar entradas no cliente e no servidor.
- Utilizar consultas SQL parametrizadas.
- Centralizar configurações sensíveis em variáveis de ambiente.
- Não versionar `.env`, credenciais ou tokens.
- Registrar alterações estruturais do banco em scripts versionados.
