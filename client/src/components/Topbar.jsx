import React from 'react';
import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const titles = {
  "/painel":["Visão geral","Acompanhe suas solicitações e o andamento dos atendimentos."],
  "/chamados":["Meus chamados","Consulte o histórico e acompanhe cada solicitação."],
  "/novo-chamado":["Abrir chamado","Conte para nossa equipe como podemos ajudar."],
  "/perfil":["Meu perfil","Gerencie as informações da sua conta."]
};
export default function Topbar({user,onMenu}) {
  const location=useLocation();
  const [title,subtitle]=titles[location.pathname]||titles["/painel"];
  return <header className="topbar">
    <div className="topbar-heading"><button className="icon-button menu-toggle" onClick={onMenu} aria-label="Abrir menu"><Menu/></button><div><h1>{title}</h1><p>{subtitle}</p></div></div>
    <div className="topbar-actions"><span className="secure-label"><span/> Ambiente demonstrativo</span><button className="icon-button notification-button" aria-label="Notificações"><Bell size={19}/><i/></button><div className="topbar-avatar">{(user?.name||"C").slice(0,1).toUpperCase()}</div></div>
  </header>;
}