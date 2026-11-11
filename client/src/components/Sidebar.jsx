import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Ticket, PlusCircle, UserRound, LogOut, Headset, X } from "lucide-react";

const links = [
  {to:"/painel",label:"Visão geral",icon:LayoutDashboard},
  {to:"/chamados",label:"Meus chamados",icon:Ticket},
  {to:"/novo-chamado",label:"Novo chamado",icon:PlusCircle},
  {to:"/perfil",label:"Meu perfil",icon:UserRound}
];

export default function Sidebar({user,open,onClose,onLogout}) {
  const navigate = useNavigate();
  return <>
    {open && <button className="mobile-scrim" aria-label="Fechar menu" onClick={onClose}/>}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand">
        <span className="brand-mark">G</span><span>G-TECH<small>PORTAL DO CLIENTE</small></span>
        <button className="icon-button sidebar-close" onClick={onClose} aria-label="Fechar menu"><X size={19}/></button>
      </div>
      <div className="nav-caption">MENU PRINCIPAL</div>
      <nav className="side-nav">
        {links.map(({to,label,icon:Icon})=><NavLink key={to} to={to} onClick={onClose} className={({isActive})=>isActive?"nav-link active":"nav-link"}><Icon size={18}/><span>{label}</span></NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="support-card"><Headset size={20}/><strong>Precisa de ajuda?</strong><span>Estamos aqui para atender você.</span><button onClick={()=>navigate("/novo-chamado")}>Falar com suporte <span>↗</span></button></div>
        <div className="sidebar-user"><div className="avatar">{(user?.name||"C").slice(0,1).toUpperCase()}</div><div className="user-meta"><strong>{user?.name||"Cliente"}</strong><span>Conta cliente</span></div><button className="icon-button" onClick={onLogout} title="Sair"><LogOut size={17}/></button></div>
      </div>
    </aside>
  </>;
}