import React from 'react';
import { useState } from "react";
import { Save,ShieldCheck } from "lucide-react";
export default function Profile({user,onSave}) {
  const [name,setName]=useState(user?.name||""); const [saved,setSaved]=useState(false);
  function submit(e){e.preventDefault();onSave({name:name.trim()});setSaved(true);window.setTimeout(()=>setSaved(false),2500);}
  return <section className="content-card profile-card"><div className="profile-heading"><div className="profile-avatar">{(name||"C").slice(0,1).toUpperCase()}</div><div><h3>{name||"Cliente"}</h3><span>Conta de cliente</span></div></div><form className="ticket-form" onSubmit={submit}>
    <label>Nome completo<input value={name} onChange={e=>setName(e.target.value)} required minLength="3"/></label>
    <label>E-mail<input value={user?.email||""} disabled/><small>O e-mail não pode ser alterado neste ambiente.</small></label>
    <div className="privacy-note"><ShieldCheck size={17}/> Seus dados são utilizados para identificar suas solicitações.</div>
    <div className="form-actions"><span>{saved?"Alterações salvas neste navegador.":"Atualize seus dados de exibição."}</span><button className="button-primary" type="submit"><Save size={16}/> Salvar alterações</button></div>
  </form></section>;
}