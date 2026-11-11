import React from 'react';
const map={"Aguardando atendimento":"waiting","Em atendimento":"progress","Aguardando cliente":"client","Resolvido":"done","Cancelado":"cancelled"};
export default function TicketStatus({status}) { return <span className={`status-pill ${map[status]||"waiting"}`}><i/>{status}</span>; }