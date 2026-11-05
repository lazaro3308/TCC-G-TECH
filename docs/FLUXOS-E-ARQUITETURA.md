# Fluxos do Sistema e Arquitetura

**Projeto:** G-TECH  
**Documento:** FA-001  
**Versão:** 1.0

## 1. Fluxo principal de atendimento

```mermaid
flowchart TD
    A([Início]) --> B[Cliente acessa a plataforma]
    B --> C{Autenticado?}
    C -- Não --> D[Realizar login ou cadastro]
    D --> C
    C -- Sim --> E[Registrar chamado]
    E --> F[Validar os dados]
    F --> G{Dados válidos?}
    G -- Não --> E
    G -- Sim --> H[Salvar chamado como ABERTO]
    H --> I[Notificar equipe]
    I --> J[Funcionário realiza triagem]
    J --> K{É necessário atendimento técnico?}
    K -- Não --> L[Solicitar informações ou orientar cliente]
    L --> J
    K -- Sim --> M[Atribuir técnico]
    M --> N[Técnico realiza atendimento]
    N --> O{Solução identificada?}
    O -- Não --> N
    O -- Sim --> P[Registrar solução e marcar RESOLVIDO]
    P --> Q[Notificar cliente]
    Q --> R{Cliente confirma a solução?}
    R -- Não --> J
    R -- Sim --> S[Encerrar chamado]
    S --> T[Disponibilizar avaliação]
    T --> U([Fim])
```

## 2. Fluxo de autenticação e autorização

```mermaid
flowchart TD
    A([Solicitação]) --> B[Receber credenciais]
    B --> C[Validar credenciais no servidor]
    C --> D{Conta ativa e credenciais válidas?}
    D -- Não --> E[Retornar resposta de autenticação inválida]
    D -- Sim --> F[Estabelecer sessão segura]
    F --> G[Identificar perfil e contexto]
    G --> H{Operação autorizada?}
    H -- Não --> I[Retornar HTTP 403]
    H -- Sim --> J[Executar operação]
    J --> K[Registrar evento quando aplicável]
    K --> L([Responder])
```

## 3. Arquitetura lógica

```mermaid
flowchart LR
    WEB[Aplicação React] -->|HTTP / JSON| API[Servidor Node.js]
    APP[Aplicativo Expo - etapa futura] -->|HTTP / JSON| API
    API --> ROUTES[Rotas HTTP]
    ROUTES --> CTRL[Controllers]
    CTRL --> AUTH[Autenticação e autorização]
    AUTH --> SERVICES[Serviços e regras de negócio]
    SERVICES --> REPOS[Repositórios]
    REPOS --> DB[(MySQL)]
    SERVICES --> STORAGE[Armazenamento de anexos]
```

## 4. Justificativa das tecnologias

| Tecnologia | Aplicação | Justificativa |
|---|---|---|
| React | Interface web | Construção de interfaces baseadas em componentes. |
| JavaScript | Web e servidor | Padronização da linguagem entre as camadas. |
| CSS | Interface | Controle de identidade visual, responsividade e acessibilidade. |
| Node.js | API | Execução de JavaScript no servidor. |
| `node:http` | Servidor HTTP | Implementação sem utilização do Express. |
| MySQL | Persistência | Banco relacional com transações e integridade referencial. |
| React Native + Expo | Aplicativo futuro | Desenvolvimento móvel com base no ecossistema JavaScript. |
| Git/GitHub | Versionamento | Histórico de alterações e colaboração. |

## 5. Considerações de implantação

A aplicação web e a API serão executadas como serviços separados durante o desenvolvimento. O MySQL será executado de forma independente. Em produção, deverão ser definidos domínio, HTTPS, política de CORS, gestão de segredos, armazenamento de anexos, backup e monitoramento.
