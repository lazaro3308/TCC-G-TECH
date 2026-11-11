import React from 'react';
import { useState } from "react";
import { ArrowRight, ShieldCheck, Headset, Zap } from "lucide-react";

export default function Login({onLogin}) {
  const [email,setEmail]=useState("cliente@gtech.com");
  const [password,setPassword]=useState("gtech123");
  const [name,setName]=useState("Cliente G-TECH");
  const [mode,setMode]=useState("login");
  const [error,setError]=useState("");
  function submit(e) {
    e.preventDefault();
    if(!email.trim()||!password.trim()||(mode==="register"&&!name.trim())) {setError("Preencha todos os campos.");return;}
    onLogin({name:name.trim()||"Cliente G-TECH",email:email.trim(),company:"Cliente G-TECH"});
  }
  return <main className="auth-screen">
    <section className="auth-showcase">
      <div className="auth-brand"><span className="brand-mark">G</span> G-TECH</div>
      <div className="showcase-content"><span className="eyebrow">SUPORTE TÉCNICO INTELIGENTE</span><h1>Seu suporte.<br/><em>Mais simples.</em></h1><p>Abra solicitações, acompanhe atualizações e tenha todo o suporte técnico em um só lugar.</p>
        <div className="showcase-points"><span><ShieldCheck/> Atendimento organizado</span><span><Zap/> Acompanhamento centralizado</span><span><Headset/> Suporte em um só lugar</span></div>
      </div><div className="auth-footer">G-TECH · Plataforma de atendimento</div>
    </section>
    <section className="auth-form-area"><form className="auth-form" onSubmit={submit}>
      <div className="mobile-auth-brand"><span className="brand-mark">G</span> G-TECH</div>
      <span className="eyebrow">{mode==="login"?"BEM-VINDO DE VOLTA":"CRIE SUA CONTA"}</span>
      <h2>{mode==="login"?"Acesse sua conta":"Comece por aqui"}</h2>
      <p className="muted">{mode==="login"?"Entre para acompanhar seus chamados.":"Preencha os dados para acessar o portal demonstrativo."}</p>
      {mode==="register"&&<label>Nome completo<input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome" autoComplete="name"/></label>}
      <label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com" autoComplete="email" required/></label>
      <label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha" autoComplete={mode==="login"?"current-password":"new-password"} required/></label>
      {error&&<p className="form-error">{error}</p>}
      <button className="button-primary button-wide" type="submit">{mode==="login"?"Entrar no portal":"Criar acesso"} <ArrowRight size={18}/></button>
      <p className="auth-switch">{mode==="login"?"Ainda não tem acesso?":"Já possui uma conta?"} <button type="button" onClick={()=>{setMode(mode==="login"?"register":"login");setError("");}}>{mode==="login"?"Criar conta":"Fazer login"}</button></p>
      <div className="demo-note"><ShieldCheck size={17}/><span><strong>Modo de demonstração</strong> — a autenticação real será ativada quando a API estiver integrada. Os dados preenchidos servem para visualizar o portal.</span></div>
    </form></section>
  </main>;
}