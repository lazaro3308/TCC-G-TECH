import React,{useState} from "react";
import {ArrowRight,ShieldCheck,Headset,Zap,UserPlus} from "lucide-react";
import {login,registerClient,requestTechnicianAccount} from "../services/api.js";

export default function Login({onLogin}){
  const [perfil,setPerfil]=useState("cliente");
  const [mode,setMode]=useState("login");
  const [nome,setNome]=useState("");
  const [email,setEmail]=useState("");
  const [senha,setSenha]=useState("");
  const [confirmarSenha,setConfirmarSenha]=useState("");
  const [empresa,setEmpresa]=useState("");
  const [telefone,setTelefone]=useState("");
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);

  function changeProfile(value){
    setPerfil(value);setMode("login");setError("");setNotice("");
  }
  async function submit(e){
    e.preventDefault();setError("");setNotice("");setBusy(true);
    try{
      if(mode==="technician-register"){
        if(senha!==confirmarSenha)throw new Error("As senhas não coincidem.");
        const result=await requestTechnicianAccount({nome,email,senha,telefone});
        setNotice(result.mensagem || "Solicitação enviada. Aguarde a aprovação.");
        setMode("login");setSenha("");setConfirmarSenha("");
        return;
      }
      if(mode==="register"){
        const user=await registerClient({nome,email,senha,empresa});
        onLogin(user);return;
      }
      const user=await login(email,senha,perfil);
      onLogin(user);
    }catch(err){setError(err.message || "Não foi possível concluir a operação.");}
    finally{setBusy(false);}
  }

  const registering=mode==="register"||mode==="technician-register";
  const technicianRegistration=mode==="technician-register";
  return <main className="auth-screen">
    <section className="auth-showcase">
      <div className="auth-brand"><span className="brand-mark">G</span> G-TECH</div>
      <div className="showcase-content">
        <span className="eyebrow">SUPORTE TÉCNICO INTELIGENTE</span>
        <h1>Seu suporte.<br/><em>Mais simples.</em></h1>
        <p>Abra solicitações, acompanhe atualizações e tenha todo o suporte técnico em um só lugar.</p>
        <div className="showcase-points"><span><ShieldCheck/> Acesso por perfil</span><span><Zap/> Chamados centralizados</span><span><Headset/> Equipe técnica especializada</span></div>
      </div>
      <div className="auth-footer">G-TECH · Plataforma de atendimento</div>
    </section>
    <section className="auth-form-area">
      <form className="auth-form" onSubmit={submit}>
        <div className="mobile-auth-brand"><span className="brand-mark">G</span> G-TECH</div>
        <span className="eyebrow">{perfil==="tecnico"?"ACESSO DA EQUIPE TÉCNICA":perfil==="admin"?"ÁREA ADMINISTRATIVA":"PORTAL DO CLIENTE"}</span>
        <h2>{technicianRegistration?"Solicitar cadastro técnico":mode==="register"?"Criar conta de cliente":"Acesse sua conta"}</h2>
        <p className="muted">Escolha como deseja acessar a plataforma.</p>
        <label>Tipo de acesso<select value={perfil} onChange={e=>changeProfile(e.target.value)} disabled={registering}>
          <option value="cliente">Sou cliente</option><option value="tecnico">Sou técnico</option><option value="admin">Sou administrador</option>
        </select></label>
        {registering&&<label>Nome completo<input value={nome} onChange={e=>setNome(e.target.value)} required minLength="2" maxLength="120" autoComplete="name"/></label>}
        {mode==="register"&&<label>Empresa (opcional)<input value={empresa} onChange={e=>setEmpresa(e.target.value)} maxLength="160"/></label>}
        {technicianRegistration&&<label>Telefone (opcional)<input value={telefone} onChange={e=>setTelefone(e.target.value)} maxLength="30" autoComplete="tel"/></label>}
        <label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" required maxLength="190"/></label>
        <label>Senha<input type="password" value={senha} onChange={e=>setSenha(e.target.value)} autoComplete={registering?"new-password":"current-password"} minLength="12" maxLength="128" required/></label>
        {registering&&<label>Confirmar senha<input type="password" value={confirmarSenha} onChange={e=>setConfirmarSenha(e.target.value)} autoComplete="new-password" minLength="12" maxLength="128" required/></label>}
        {error&&<p className="form-error" role="alert">{error}</p>}
        {notice&&<p className="feedback success" role="status">{notice}</p>}
        <button className="button-primary button-wide" disabled={busy}>{busy?"Aguarde...":technicianRegistration?"Enviar solicitação":mode==="register"?"Criar conta":"Entrar"} <ArrowRight size={18}/></button>
        {perfil==="cliente"&&<p className="auth-switch">{mode==="login"?"Ainda não tem conta?":"Já possui cadastro?"} <button type="button" onClick={()=>{setMode(mode==="login"?"register":"login");setError("");setNotice("");}}>{mode==="login"?"Criar conta":"Fazer login"}</button></p>}
        {perfil==="tecnico"&&<p className="auth-switch">{technicianRegistration?"Já solicitou cadastro?":"Ainda não tem acesso?"} <button type="button" onClick={()=>{setMode(technicianRegistration?"login":"technician-register");setError("");setNotice("");}}>{technicianRegistration?"Voltar ao login":"Solicitar cadastro"}</button></p>}
        <div className="demo-note"><ShieldCheck size={17}/><span><strong>Autenticação protegida</strong> — solicitações de técnicos precisam ser aprovadas pela administração antes do primeiro acesso.</span></div>
      </form>
    </section>
  </main>;
}
