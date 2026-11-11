import React from 'react';
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, Ticket, Clock3, CheckCircle2, Headset, ChevronRight, CalendarDays } from "lucide-react";
import TicketStatus from "../components/TicketStatus.jsx";
const dateLabel=value=>new Date(value+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"});
export default function Dashboard({tickets,user}) {
  const open=tickets.filter(t=>!["Resolvido","Cancelado"].includes(t.status)).length;
  const progress=tickets.filter(t=>t.status==="Em atendimento").length;
  const done=tickets.filter(t=>t.status==="Resolvido").length;
  const recent=[...tickets].slice(0,4);
  return <div className="page-stack">
    <section className="welcome-banner"><div><span className="eyebrow">ÁREA DO CLIENTE</span><h2>Olá, {user?.name?.split(" ")[0]||"cliente"}! <span>✦</span></h2><p>Veja como estão suas solicitações e conte com a nossa equipe.</p><Link className="button-primary" to="/novo-chamado"><Plus size={18}/> Abrir novo chamado</Link></div><div className="welcome-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-core"><Headset size={42}/></div><span className="art-spark spark-one">✦</span><span className="art-spark spark-two">✧</span></div></section>
    <div className="section-heading"><div><h3>Resumo dos atendimentos</h3><p>Visão geral das suas solicitações.</p></div><Link to="/chamados" className="text-link">Ver todos <ArrowUpRight size={16}/></Link></div>
    <section className="stats-grid">
      <article className="stat-card"><div className="stat-icon icon-green"><Ticket/></div><span className="stat-label">Total de chamados</span><strong>{tickets.length}</strong><small>Solicitações registradas</small></article>
      <article className="stat-card"><div className="stat-icon icon-blue"><Clock3/></div><span className="stat-label">Em aberto</span><strong>{open}</strong><small>Aguardando ou em andamento</small></article>
      <article className="stat-card"><div className="stat-icon icon-purple"><Headset/></div><span className="stat-label">Em atendimento</span><strong>{progress}</strong><small>Com nossa equipe técnica</small></article>
      <article className="stat-card"><div className="stat-icon icon-amber"><CheckCircle2/></div><span className="stat-label">Resolvidos</span><strong>{done}</strong><small>Atendimentos concluídos</small></article>
    </section>
    <section className="content-card"><div className="card-heading"><div><h3>Chamados recentes</h3><p>Acompanhe suas últimas solicitações.</p></div><Link to="/chamados" className="text-link">Ver histórico <ChevronRight size={16}/></Link></div>
      {recent.length?<div className="table-wrap"><table><thead><tr><th>Solicitação</th><th>Categoria</th><th>Data</th><th>Status</th><th/></tr></thead><tbody>{recent.map(t=><tr key={t.id}><td><Link className="ticket-title" to={`/chamados/${t.id}`}>{t.title}<small>{t.id}</small></Link></td><td>{t.category}</td><td><span className="date-cell"><CalendarDays size={14}/>{dateLabel(t.date)}</span></td><td><TicketStatus status={t.status}/></td><td><Link className="row-arrow" to={`/chamados/${t.id}`} aria-label="Ver chamado"><ChevronRight size={18}/></Link></td></tr>)}</tbody></table></div>:<div className="empty-state"><Ticket/><strong>Nenhum chamado por aqui</strong><span>Quando você abrir uma solicitação, ela aparecerá nesta área.</span><Link className="button-primary" to="/novo-chamado">Abrir primeiro chamado</Link></div>}
    </section>
    <div className="bottom-tip"><div className="tip-icon"><Headset/></div><div><strong>Estamos aqui para ajudar.</strong><span>Descreva seu problema com detalhes para agilizar o atendimento.</span></div><Link to="/novo-chamado">Preciso de suporte <ArrowUpRight size={15}/></Link></div>
  </div>;
}