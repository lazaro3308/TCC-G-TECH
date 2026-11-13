import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft,Paperclip,Send,ShieldCheck } from "lucide-react";

export default function NewTicket({onCreate}) {
  
  const navigate=useNavigate(); const [form,setForm]=useState({title:"",category:"",priority:"Normal",description:""}); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e) {
    e.preventDefault();
    if(form.title.trim().length<5||form.description.trim().length<15||!form.category){setError("Informe um título, uma categoria e uma descrição com pelo menos 15 caracteres.");return;}
    setLoading(true);setError("");
    try {await onCreate(form);navigate("/chamados");}
    catch {setError("Não foi possível registrar o chamado. Tente novamente.");}
    finally {setLoading(false);}
  }
  return <div className="form-page"><button className="back-link" onClick={()=>navigate(-1)}><ArrowLeft size={16}/> Voltar</button><section className="content-card form-card">
    <div className="form-card-heading"><span className="form-symbol">＋</span><div><h3>Conte o que está acontecendo</h3><p>Preencha as informações abaixo. Nossa equipe receberá sua solicitação.</p></div></div>
    <form onSubmit={submit} className="ticket-form">
      <label>Título da solicitação <span>*</span><input name="title" value={form.title} onChange={change} placeholder="Ex.: Computador não liga" maxLength="120" required/><small>Seja breve e objetivo.</small></label>
      <div className="form-grid"><label>Categoria <span>*</span><select name="category" value={form.category} onChange={change} required><option value="">Selecione uma categoria</option>{["Hardware","Software","Rede e Internet","Acesso","Outros"].map(x=><option key={x}>{x}</option>)}</select></label><label>Prioridade<select name="priority" value={form.priority} onChange={change}><option>Baixa</option><option>Normal</option><option>Alta</option><option>Urgente</option></select></label></div>
      <label>Descrição do problema <span>*</span><textarea name="description" value={form.description} onChange={change} rows="6" maxLength="2000" placeholder="Explique o que aconteceu, quando começou e quais mensagens aparecem..." required/><small>{form.description.length}/2000 caracteres · mínimo de 15.</small></label>
      <div className="attachment-placeholder"><Paperclip size={18}/><div><strong>Anexos</strong><span>O envio de arquivos será habilitado na próxima integração com a API.</span></div><span className="coming-soon">EM BREVE</span></div>
      {error&&<p className="form-error">{error}</p>}
      <div className="form-actions"><span><ShieldCheck size={16}/> Seus dados são utilizados apenas para o atendimento.</span><button className="button-primary" type="submit" disabled={loading}>{loading?"Enviando...":"Enviar solicitação"} <Send size={16}/></button></div>
    </form>
  </section></div>;
}