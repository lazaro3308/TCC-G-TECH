import React from 'react';
import { Link,useNavigate,useParams } from "react-router-dom";
import { ArrowLeft,CalendarDays,Tag,Flag,MessageSquare,ShieldCheck } from "lucide-react";
import TicketStatus from "../components/TicketStatus.jsx";
export default function TicketDetails({tickets}) {
  const {id}=useParams(); const navigate=useNavigate(); const ticket=tickets.find(t=>t.id===id);
  if(!ticket)return <section className="content-card empty-state"><strong>Chamado não encontrado</strong><Link to="/chamados">Voltar aos chamados</Link></section>;
  const date=new Date(ticket.date+"T12:00:00").toLocaleDateString("pt-BR");
  return <div className="page-stack"><button className="back-link" onClick={()=>navigate(-1)}><ArrowLeft size={16}/> Voltar aos chamados</button><section className="content-card detail-card">
    <div className="detail-top"><div><span className="ticket-code">{ticket.id}</span><h2>{ticket.title}</h2><p>Solicitação registrada em {date}</p></div><TicketStatus status={ticket.status}/></div>
    <div className="detail-metadata"><div><Tag/><span>Categoria<strong>{ticket.category}</strong></span></div><div><Flag/><span>Prioridade<strong>{ticket.priority}</strong></span></div><div><CalendarDays/><span>Data de abertura<strong>{date}</strong></span></div></div>
    <div className="detail-description"><h3>Descrição</h3><p>{ticket.description}</p></div>
    <div className="timeline"><h3><MessageSquare size={18}/> Acompanhamento</h3><div className="timeline-item"><i/><div><strong>Solicitação registrada</strong><span>Seu chamado foi recebido pelo portal.</span><small>{date}</small></div></div><div className="timeline-item muted-timeline"><i/><div><strong>{ticket.status}</strong><span>Este é o status atual da solicitação.</span></div></div></div>
    <div className="privacy-note"><ShieldCheck size={17}/> As atualizações detalhadas serão exibidas aqui quando o histórico da API estiver disponível.</div>
  </section></div>;
}