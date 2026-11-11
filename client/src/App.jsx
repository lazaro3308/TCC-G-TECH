import { useMemo, useState } from 'react';
import { createTicket, API_URL } from './services/api';

const initialForm = { empresa: '', email: '', problema: '' };

function Icon({ name }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><circle cx="12" cy="12" r="9"/><path d="M12 8v5m0 3h.01"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Brand() {
  return <div className="brand"><span className="brand-mark">G</span><span>G-TECH<small>SUPORTE TÉCNICO</small></span></div>;
}

export default function App() {
  const [page, setPage] = useState('overview');
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [lastTicket, setLastTicket] = useState(null);
  const canSubmit = useMemo(() => Boolean(form.empresa.trim() && form.email.trim() && form.problema.trim().length >= 10), [form]);

  function update(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setFeedback(null);
    try {
      const result = await createTicket(form);
      setLastTicket({ ...form, createdAt: new Date() });
      setFeedback({ type: 'success', message: result.mensagem || 'Solicitação enviada com sucesso à equipe G-TECH.' });
      setForm(initialForm);
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return <div className="layout">
    <aside className="sidebar">
      <Brand />
      <div className="workspace-label">ÁREA DO CLIENTE</div>
      <nav className="navigation" aria-label="Navegação principal">
        <button className={page === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => { setPage('overview'); setFeedback(null); }}><Icon name="grid"/>Visão geral</button>
        <button className={page === 'new' ? 'nav-item active' : 'nav-item'} onClick={() => { setPage('new'); setFeedback(null); }}><Icon name="plus"/>Novo chamado</button>
      </nav>
      <div className="sidebar-bottom">
        <div className="secure-note"><Icon name="shield"/><div><strong>Canal de suporte</strong><span>Envio conectado à API G-TECH</span></div></div>
        <span className="version">G-TECH • PORTAL WEB</span>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="breadcrumb">Portal <span>/</span> {page === 'new' ? 'Novo chamado' : 'Visão geral'}</div>
        <div className="api-indicator"><i/> API configurada <span>·</span> {API_URL.replace(/^https?:\/\//, '')}</div>
      </header>

      {page === 'overview' ? <section className="content">
        <div className="welcome-row">
          <div><div className="overline">CENTRAL DE ATENDIMENTO</div><h1>Olá! Como podemos <em>ajudar?</em></h1><p className="lead">Conte com a equipe G-TECH para resolver suas solicitações técnicas.</p></div>
          <div className="welcome-icon"><Icon name="shield"/></div>
        </div>
        <div className="quick-grid">
          <article className="quick-card"><div className="card-icon"><Icon name="plus"/></div><span className="card-label">PRECISA DE AJUDA?</span><h2>Abra um chamado</h2><p>Descreva o que está acontecendo e envie sua solicitação para nossa equipe.</p><button className="text-action" onClick={() => { setPage('new'); setFeedback(null); }}>Criar solicitação <Icon name="arrow"/></button></article>
          <article className="quick-card muted-card"><div className="card-icon"><Icon name="clock"/></div><span className="card-label">ACOMPANHAMENTO</span><h2>Solicitação enviada</h2><p>{lastTicket ? 'Seu último envio foi recebido nesta sessão.' : 'A confirmação do envio aparecerá aqui após registrar uma solicitação.'}</p>{lastTicket && <div className="last-ticket"><Icon name="check"/> Enviado · {lastTicket.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>}</article>
        </div>
        {lastTicket && <section className="confirmation-card"><div className="confirmation-icon"><Icon name="check"/></div><div><strong>Último envio confirmado</strong><p>{lastTicket.empresa} · {lastTicket.email}</p></div><span className="status-pill">Recebido pela API</span></section>}
        <section className="info-banner"><div className="info-symbol">i</div><div><strong>Sobre o portal</strong><p>O envio de chamados já utiliza o servidor. Login e consulta de histórico serão conectados quando essas funcionalidades forem implementadas na API.</p></div></section>
      </section> : <section className="content form-content">
        <button className="back-link" onClick={() => { setPage('overview'); setFeedback(null); }}>← Voltar à visão geral</button>
        <div className="overline">FALE COM A NOSSA EQUIPE</div><h1>Novo <em>chamado</em></h1>
        <p className="lead">Preencha os campos abaixo. Sua solicitação será enviada diretamente ao servidor G-TECH.</p>
        <div className="form-layout">
          <form className="ticket-form" onSubmit={submit}>
            <div className="form-heading"><div><span>01 / SOLICITAÇÃO</span><h2>Detalhes do atendimento</h2></div><span className="required-note">* Campos obrigatórios</span></div>
            <label>Empresa ou nome completo <b>*</b><input name="empresa" value={form.empresa} onChange={update} placeholder="Como podemos identificar você?" maxLength="150" required/></label>
            <label>E-mail para contato <b>*</b><input type="email" name="email" value={form.email} onChange={update} placeholder="voce@empresa.com" maxLength="190" required/></label>
            <label>Descreva o problema <b>*</b><textarea name="problema" value={form.problema} onChange={update} placeholder="Explique o que aconteceu e quais mensagens aparecem..." rows="6" minLength="10" maxLength="5000" required/><span className="field-hint">Mínimo de 10 caracteres. Quanto mais detalhes, melhor.</span></label>
            {feedback && <div className={`feedback ${feedback.type}`} role="status"><Icon name={feedback.type === 'success' ? 'check' : 'alert'}/><span>{feedback.message}</span></div>}
            <button className="submit-button" type="submit" disabled={!canSubmit || loading}>{loading ? 'Enviando solicitação...' : 'Enviar chamado'} <Icon name="arrow"/></button>
            <p className="privacy-note"><Icon name="shield"/> Os dados serão enviados ao endpoint de atendimento configurado.</p>
          </form>
          <aside className="form-aside"><div className="aside-icon"><Icon name="clock"/></div><h3>O que acontece depois?</h3><p>O servidor recebe os dados e retorna uma confirmação. A consulta do histórico ficará disponível quando a API oferecer essa rota.</p><div className="aside-divider"/><span className="aside-label">ENDPOINT CONECTADO</span><strong>POST /chamados</strong><code>{API_URL}/chamados</code></aside>
        </div>
      </section>}
      <footer className="footer"><span>© {new Date().getFullYear()} G-TECH · Plataforma de suporte técnico</span><span>Desenvolvido para aproximar pessoas e soluções.</span></footer>
    </main>
  </div>;
}
