import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Tag, Flag, MessageSquare, ShieldCheck, UserRound, RefreshCw } from "lucide-react";
import TicketStatus from "../components/TicketStatus.jsx";
import { getTicketHistory } from "../services/api.js";

export default function TicketDetails({ tickets }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = tickets.find(item => String(item.id) === String(id));
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);

  const loadHistory = useCallback(async () => {
    if (!id) return;
    try {
      const rows = await getTicketHistory(id);
      setHistory(rows);
      setHistoryError("");
    } catch (error) {
      setHistoryError(error.message || "Não foi possível carregar o histórico.");
    } finally {
      setLoadingHistory(false);
    }
  }, [id]);

  useEffect(() => {
    loadHistory();
    const timer = window.setInterval(loadHistory, 15000);
    return () => window.clearInterval(timer);
  }, [loadHistory]);

  if (!ticket) {
    return (
      <section className="content-card empty-state">
        <strong>Chamado não encontrado</strong>
        <span>Confira se o protocolo está correto ou atualize a lista de chamados.</span>
        <Link to="/chamados">Voltar aos chamados</Link>
      </section>
    );
  }

  const date = ticket.date
    ? new Date(ticket.date + "T12:00:00").toLocaleDateString("pt-BR")
    : "Data indisponível";

  return (
    <div className="page-stack">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Voltar aos chamados
      </button>
      <section className="content-card detail-card">
        <div className="detail-top">
          <div>
            <span className="ticket-code">{ticket.id}</span>
            <h2>{ticket.title}</h2>
            <p>Solicitação registrada em {date}</p>
          </div>
          <TicketStatus status={ticket.status} />
        </div>

        <div className="detail-metadata">
          <div><Tag /><span>Categoria<strong>{ticket.category}</strong></span></div>
          <div><Flag /><span>Prioridade<strong>{ticket.priority}</strong></span></div>
          <div><CalendarDays /><span>Data de abertura<strong>{date}</strong></span></div>
          <div><UserRound /><span>Responsável técnico<strong>{ticket.tecnico_nome || "Aguardando atribuição"}</strong></span></div>
        </div>

        <div className="detail-description">
          <h3>Descrição</h3>
          <p>{ticket.description}</p>
        </div>

        {ticket.resposta_tecnica && (
          <div className="detail-description">
            <h3>Resposta da equipe técnica</h3>
            <p>{ticket.resposta_tecnica}</p>
          </div>
        )}

        <div className="timeline">
          <div className="ticket-history-heading">
            <h3><MessageSquare size={18} /> Histórico do atendimento</h3>
            <button type="button" onClick={loadHistory} disabled={loadingHistory} aria-label="Atualizar histórico">
              <RefreshCw size={15} /> Atualizar
            </button>
          </div>
          {historyError && <p className="history-feedback">{historyError}</p>}
          {loadingHistory ? (
            <p className="history-feedback">Carregando histórico...</p>
          ) : history.length ? (
            history.map(event => (
              <div className="timeline-item" key={event.id}>
                <i />
                <div>
                  <strong>{event.status_novo ? event.status_novo : event.mensagem}</strong>
                  {event.status_novo && <span>{event.mensagem}</span>}
                  <span>Por {event.autor_nome} · {event.autor_perfil === "tecnico" ? "Equipe técnica" : "Cliente"}</span>
                  <small>{new Date(event.criado_em).toLocaleString("pt-BR")}</small>
                </div>
              </div>
            ))
          ) : (
            <p className="history-feedback">Ainda não há eventos registrados para este chamado.</p>
          )}
        </div>

        <div className="privacy-note">
          <ShieldCheck size={17} /> O histórico é atualizado automaticamente a cada 15 segundos.
        </div>
      </section>
    </div>
  );
}
