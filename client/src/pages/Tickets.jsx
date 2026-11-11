import React from 'react';
import { useMemo,useState } from "react";
import { Link } from "react-router-dom";
import { Search,Plus,Filter,ChevronRight,CalendarDays,Ticket } from "lucide-react";
import TicketStatus from "../components/TicketStatus.jsx";
export default function Tickets({tickets}) {
  const [query,setQuery]=useState(""); const [status,setStatus]=useState("Todos");
  const filtered=useMemo(()=>tickets.filter(t=>(status==="Todos"||t.status===status)&&`${t.title} ${t.id} ${t.category}`.toLowerCase().includes(query.toLowerCase())),[tickets,query,status]);
  return <div className="page-stack"><div className="page-toolbar"><div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por título, código ou categoria..."/></div><Link className="button-primary" to="/novo-chamado"><Plus size={17}/> Novo chamado</Link></div>
    <section className="content-card"><div className="filter-row"><div><h3>Todos os chamados</h3><p>{filtered.length} solicitação(ões) encontrada(s)</p></div><label className="select-filter"><Filter size={16}/><select value={status} onChange={e=>setStatus(e.target.value)}><option>Todos</option>{["Aguardando atendimento","Em atendimento","Aguardando cliente","Resolvido","Cancelado"].map(s=><option key={s}>{s}</option>)}</select></label></div>
      {filtered.length?<div className="table-wrap"><table><thead><tr><th>Solicitação</th><th>Categoria</th><th>Prioridade</th><th>Data de abertura</th><th>Status</th><th/></tr></thead><tbody>{filtered.map(t=><tr key={t.id}><td><Link className="ticket-title" to={`/chamados/${t.id}`}>{t.title}<small>{t.id}</small></Link></td><td>{t.category}</td><td><span className={`priority priority-${t.priority.toLowerCase()}`}>{t.priority}</span></td><td><span className="date-cell"><CalendarDays size={14}/>{new Date(t.date+"T12:00:00").toLocaleDateString("pt-BR")}</span></td><td><TicketStatus status={t.status}/></td><td><Link className="row-arrow" to={`/chamados/${t.id}`} aria-label="Detalhes"><ChevronRight size={18}/></Link></td></tr>)}</tbody></table></div>:<div className="empty-state"><Ticket/><strong>Nenhum resultado encontrado</strong><span>Tente alterar a busca ou o filtro selecionado.</span></div>}
    </section></div>;
}