import React,{useCallback,useEffect,useState} from "react";
import {Check, X, RefreshCw, ShieldCheck, LogOut, Users, Clock3} from "lucide-react";
import {decideTechnicianRequest,getAdminTechnicians,getTechnicianRequests} from "../services/api.js";

export default function AdminDashboard({user,onLogout}){
  const [requests,setRequests]=useState([]);
  const [technicians,setTechnicians]=useState([]);
  const [filter,setFilter]=useState("pendente");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");

  const load=useCallback(async()=>{
    setBusy(true);setError("");
    try{
      const [pending,team]=await Promise.all([getTechnicianRequests(filter),getAdminTechnicians()]);
      setRequests(pending);setTechnicians(team);
    }catch(err){setError(err.message||"Não foi possível carregar os dados administrativos.");}
    finally{setBusy(false);}
  },[filter]);
  useEffect(()=>{load();},[load]);

  async function decide(request,decision){
    let motivo="";
    if(decision==="recusar"){
      motivo=window.prompt("Motivo da recusa (opcional):")||"";
      if(motivo.length>500){setError("O motivo deve ter até 500 caracteres.");return;}
    }
    setBusy(true);setError("");setNotice("");
    try{
      const result=await decideTechnicianRequest(request.id,decision,motivo);
      setNotice(result.mensagem);await load();
    }catch(err){setError(err.message||"Não foi possível processar a solicitação.");}
    finally{setBusy(false);}
  }

  return <main className="tech-shell">
    <header className="tech-header">
      <div className="tech-brand"><span>G</span><div><strong>G-TECH</strong><small>ADMINISTRAÇÃO</small></div></div>
      <div className="tech-user"><ShieldCheck size={17}/><span>{user?.nome||"Administrador"}</span><button onClick={onLogout} title="Sair" aria-label="Sair"><LogOut size={17}/></button></div>
    </header>
    <section className="tech-content">
      <div className="tech-title"><div><span className="eyebrow">CONTROLE DE ACESSO</span><h1>Administração</h1><p>Analise solicitações e gerencie o acesso da equipe técnica.</p></div>
        <button className="tech-refresh" onClick={load} disabled={busy}><RefreshCw size={16}/> Atualizar</button>
      </div>
      <div className="tech-stats">
        <article><Clock3/><span>Solicitações exibidas</span><strong>{requests.length}</strong></article>
        <article><Users/><span>Técnicos cadastrados</span><strong>{technicians.length}</strong></article>
        <article><Check/><span>Técnicos ativos</span><strong>{technicians.filter(t=>t.ativo).length}</strong></article>
        <article><ShieldCheck/><span>Perfil</span><strong>Admin</strong></article>
      </div>
      {error&&<p className="tech-alert" role="alert">{error}</p>}
      {notice&&<p className="tech-success" role="status">{notice}</p>}
      <section className="tech-panel">
        <div className="tech-tools">
          <h2>Solicitações de cadastro</h2>
          <select value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Filtrar solicitações">
            <option value="pendente">Pendentes</option><option value="aprovada">Aprovadas</option><option value="recusada">Recusadas</option><option value="todas">Todas</option>
          </select>
        </div>
        {busy&&!requests.length?<p className="tech-empty">Carregando solicitações...</p>:requests.length===0?<p className="tech-empty">Nenhuma solicitação encontrada.</p>:
          <div className="tech-list">{requests.map(item=><article className="tech-ticket" key={item.id}>
            <div className="tech-ticket-head"><div><small>Solicitação #{item.id} · {new Date(item.criado_em).toLocaleString("pt-BR")}</small><h2>{item.nome}</h2><p>{item.email}{item.telefone?" · "+item.telefone:""}</p></div><span className="tech-priority">{item.status}</span></div>
            {item.motivo_recusa&&<p className="tech-description">Motivo: {item.motivo_recusa}</p>}
            {item.status==="pendente"&&<div className="tech-ticket-actions"><button disabled={busy} onClick={()=>decide(item,"aprovar")}><Check size={15}/> Aprovar técnico</button><button disabled={busy} onClick={()=>decide(item,"recusar")}><X size={15}/> Recusar</button></div>}
          </article>)}</div>}
      </section>
      <section className="tech-panel">
        <div className="tech-tools"><h2>Equipe técnica</h2></div>
        <div className="tech-list">{technicians.length===0?<p className="tech-empty">Nenhum técnico cadastrado.</p>:technicians.map(person=><article className="tech-ticket" key={person.id}>
          <div className="tech-ticket-head"><div><h2>{person.nome}</h2><p>{person.email}</p></div><span className="tech-priority">{person.ativo?"Ativo":"Inativo"}</span></div>
        </article>)}</div>
      </section>
      <p className="tech-foot"><ShieldCheck size={15}/> Área restrita. Somente contas administrativas podem aprovar solicitações.</p>
    </section>
  </main>;
}
