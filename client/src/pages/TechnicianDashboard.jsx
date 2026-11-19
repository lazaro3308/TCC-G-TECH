import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, ShieldCheck, Ticket, Clock3, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { apiRequest } from "../services/api.js";

const statuses = ["Aguardando atendimento","Em atendimento","Aguardando cliente","Resolvido","Cancelado"];
export default function TechnicianDashboard({ user, onLogout }) {
  const [tickets,setTickets] = useState([]);
  const [query,setQuery] = useState("");
  const [filter,setFilter] = useState("Todos");
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState("");
  const [drafts,setDrafts] = useState({});
  async function load() {
    setBusy(true); setError("");
    try { const data=await apiRequest("/chamados"); setTickets(data.chamados || []); }
    catch(e) { setError(e.message); }
    finally { setBusy(false); }
  }
  useEffect(()=>{ load(); },[]);
  const filtered=useMemo(()=>tickets.filter(t=>(filter==="Todos"||t.status===filter)&&[t.codigo,t.titulo,t.cliente_nome,t.cliente_email].join(" ").toLowerCase().includes(query.toLowerCase())),[tickets,filter,query]);
  async function update(ticket) {
    const draft=drafts[ticket.id] || {};
    setBusy(true); setError(""); setNotice("");
    try {
      await apiRequest(`/chamados/${ticket.id}`,{method:"PATCH",body:JSON.stringify({status:draft.status || ticket.status,resposta:draft.resposta || ""})});
      setNotice(`Chamado ${ticket.codigo} atualizado.`);
      await load();
    } catch(e) { setError(e.message); }
    finally { setBusy(false); }
  }
  const count=status=>tickets.filter(t=>t.status===status).length;
  return <main className="tech-shell">
    <header className="tech-header"><div className="tech-brand"><span>G</span><div><strong>G-TECH</strong><small>PAINEL TÉCNICO</small></div></div><div className="tech-user"><ShieldCheck size={17}/><span>{user?.nome || user?.name || "Técnico"}</span><button onClick={onLogout} title="Sair"><LogOut size={17}/></button></div></header>
    <section className="tech-content"><div className="tech-title"><div><span className="eyebrow">CENTRAL DE OPERAÇÕES</span><h1>Gestão de chamados</h1><p>Visualize solicitações e atualize o atendimento dos clientes.</p></div><button className="tech-refresh" onClick={load} disabled={busy}><RefreshCw size={16}/> Atualizar</button></div>
      <div className="tech-stats"><article><Ticket/><span>Total de chamados</span><strong>{tickets.length}</strong></article><article><AlertCircle/><span>Aguardando</span><strong>{count("Aguardando atendimento")}</strong></article><article><Clock3/><span>Em atendimento</span><strong>{count("Em atendimento")}</strong></article><article><CheckCircle2/><span>Resolvidos</span><strong>{count("Resolvido")}</strong></article></div>
      {error&&<p className="tech-alert">{error}</p>}{notice&&<p className="tech-success">{notice}</p>}
      <section className="tech-panel"><div className="tech-tools"><div className="tech-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar chamado, cliente ou código"/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>Todos</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></div>
      {busy&&!tickets.length?<p className="tech-empty">Carregando chamados...</p>:filtered.length===0?<p className="tech-empty">Nenhum chamado encontrado.</p>:<div className="tech-list">{filtered.map(t=><article className="tech-ticket" key={t.id}><div className="tech-ticket-head"><div><small>{t.codigo} · {new Date(t.criado_em).toLocaleString("pt-BR")}</small><h2>{t.titulo}</h2><p>{t.cliente_nome} · {t.cliente_email}</p></div><span className={`tech-priority priority-${t.prioridade.toLowerCase()}`}>{t.prioridade}</span></div><p className="tech-description">{t.descricao}</p><div className="tech-ticket-actions"><label>Status<select value={drafts[t.id]?.status ?? t.status} onChange={e=>setDrafts(d=>({...d,[t.id]:{...d[t.id],status:e.target.value}}))}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label className="tech-reply">Resposta ao cliente<textarea rows="2" maxLength="3000" value={drafts[t.id]?.resposta ?? t.resposta_tecnica ?? ""} onChange={e=>setDrafts(d=>({...d,[t.id]:{...d[t.id],resposta:e.target.value}}))} placeholder="Registre uma orientação ou solução..."/></label><button onClick={()=>update(t)} disabled={busy}>Salvar atualização</button></div></article>)}</div>}
      </section>
      <p className="tech-foot"><ShieldCheck size={15}/> Área restrita. Ações registradas no histórico do chamado.</p>
    </section>
  </main>;
}
