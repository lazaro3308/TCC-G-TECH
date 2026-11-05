export default function App() {
  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="G-TECH página inicial">
          <span className="brand-symbol">G</span>
          <span>G-TECH</span>
        </a>
        <span className="system-status"><span /> Ambiente de desenvolvimento</span>
      </header>

      <section className="hero">
        <p className="eyebrow">SUPORTE • SOLUÇÃO • CONFIANÇA</p>
        <h1>Gestão técnica com <span>eficiência.</span></h1>
        <p className="hero-description">
          Uma plataforma centralizada para registrar, acompanhar e gerenciar
          solicitações de suporte técnico.
        </p>
        <a className="primary-link" href="#project">Conheça o projeto</a>
      </section>

      <section className="project-panel" id="project">
        <p className="eyebrow">G-TECH / PLATAFORMA DE ATENDIMENTO</p>
        <h2>Estrutura inicial em desenvolvimento</h2>
        <p>
          A base do projeto está organizada. As funcionalidades de autenticação,
          chamados e painéis serão implementadas de forma incremental, após a
          validação do banco de dados e da API.
        </p>
      </section>
    </main>
  );
}
