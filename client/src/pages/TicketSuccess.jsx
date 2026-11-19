import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, CheckCircle2, Clock3, Headphones, Home, RefreshCw, Ticket } from "lucide-react";

const stages = [
  { title: "Chamado recebido", description: "Sua solicitação foi registrada no sistema." },
  { title: "Em atendimento", description: "Nossa equipe técnica está trabalhando na solicitação." },
  { title: "Concluído", description: "A equipe finalizou o atendimento." },
];

function getStage(status) {
  if (status === "Resolvido") return 2;
  if (status === "Em atendimento" || status === "Aguardando cliente") return 1;
  return 0;
}

export default function TicketSuccess({ tickets = [] }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = tickets.find(item => String(item.id) === String(id)) ||
    (String(location.state?.ticket?.id) === String(id) ? location.state.ticket : null);
  const status = ticket?.status || "Aguardando atendimento";
  const stage = getStage(status);
  const waitingForClient = status === "Aguardando cliente";
  const canceled = status === "Cancelado";

  return (
    <main className="ticket-success-page">
      <section className="ticket-success-card" aria-live="polite">
        <div className="ticket-success-icon"><Check size={34} strokeWidth={3} /></div>
        <span className="ticket-success-eyebrow">G-TECH · CENTRAL DE SUPORTE</span>
        <h1>Chamado realizado com sucesso!</h1>
        <p className="ticket-success-lead">Sua solicitação foi registrada. Nossa equipe já pode visualizar seu chamado e você poderá acompanhar cada atualização por aqui.</p>

        {ticket ? (
          <div className="ticket-success-reference">
            <span>PROTOCOLO DO ATENDIMENTO</span>
            <strong>{ticket.id}</strong>
            <small>{ticket.title}</small>
          </div>
        ) : (
          <div className="ticket-success-reference">
            <span>PROTOCOLO DO ATENDIMENTO</span>
            <strong>{id}</strong>
            <small>Consulte os detalhes na área de chamados.</small>
          </div>
        )}

        <div className="ticket-progress-heading">
          <div><span>ACOMPANHAMENTO</span><strong>Andamento da solicitação</strong></div>
          <span className={`ticket-current-status ${canceled ? "is-canceled" : ""}`}>{status}</span>
        </div>

        {canceled ? (
          <div className="ticket-status-message"><Headphones size={19} /><p>Este chamado foi cancelado. Se precisar de ajuda, entre em contato com a equipe de suporte.</p></div>
        ) : (
          <>
            <div className="ticket-progress-track">
              {stages.map((item, index) => (
                <div className={`ticket-progress-step ${index <= stage ? "is-complete" : ""} ${index === stage ? "is-current" : ""}`} key={item.title}>
                  <span className="ticket-progress-dot">{index < stage ? <Check size={14} /> : index === stage ? <span /> : index + 1}</span>
                  <div><strong>{item.title}</strong><small>{index === stage && waitingForClient ? "A equipe aguarda uma informação sua." : item.description}</small></div>
                </div>
              ))}
            </div>
            <div className="ticket-status-message">
              {waitingForClient ? <Headphones size={19} /> : status === "Resolvido" ? <CheckCircle2 size={19} /> : <RefreshCw size={19} />}
              <p>{waitingForClient ? "Há uma atualização que depende de você. Abra os detalhes do chamado para consultar a resposta técnica." : status === "Resolvido" ? "Seu atendimento foi concluído. Obrigado por utilizar o G-TECH!" : "O status é atualizado automaticamente enquanto você acompanha esta página. Você também pode consultar os detalhes na área de chamados."}</p>
            </div>
          </>
        )}

        <div className="ticket-success-actions">
          <button className="ticket-home-button" onClick={() => navigate("/painel")}><Home size={17} /> Voltar ao início</button>
          <Link className="ticket-view-link" to={`/chamados/${encodeURIComponent(id)}`}><Ticket size={16} /> Ver detalhes do chamado</Link>
        </div>
        <div className="ticket-auto-refresh"><Clock3 size={14} /> Atualizações verificadas automaticamente a cada 15 segundos.</div>
      </section>
    </main>
  );
}
