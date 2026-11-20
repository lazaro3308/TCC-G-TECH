import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCw, Search, ShieldCheck, Ticket, Clock3, CheckCircle2,
  AlertCircle, LogOut, UserRound, History, ChevronDown, UserCheck,
} from "lucide-react";
import { apiRequest, getTicketHistory, getTechnicians } from "../services/api.js";

const statuses = [
  "Aguardando atendimento",
  "Em atendimento",
  "Aguardando cliente",
  "Resolvido",
  "Cancelado",
];
const priorities = ["Urgente", "Alta", "Normal", "Baixa"];

export default function TechnicianDashboard({ user, onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [priorityFilter, setPriorityFilter] = useState("Todas");
  const [assigneeFilter, setAssigneeFilter] = useState("Todos");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [drafts, setDrafts] = useState({});
  const [expandedHistory, setExpandedHistory] = useState({});
  const [histories, setHistories] = useState({});
  const [historyLoading, setHistoryLoading] = useState({});

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const [ticketData, technicianData] = await Promise.all([
        apiRequest("/chamados"),
        getTechnicians(),
      ]);
      setTickets(ticketData.chamados || []);
      setTechnicians(technicianData);
    } catch (loadError) {
      setError(loadError.message || "Não foi possível carregar os chamados.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 30000);
    return () => window.clearInterval(timer);
  }, [load]);

  const filtered = useMemo(() => tickets.filter(ticket => {
    const matchesStatus = filter === "Todos" || ticket.status === filter;
    const matchesPriority = priorityFilter === "Todas" || ticket.prioridade === priorityFilter;
    const matchesAssignee = assigneeFilter === "Todos" ||
      (assigneeFilter === "sem_responsavel"
        ? !ticket.tecnico_id
        : String(ticket.tecnico_id) === assigneeFilter);
    const searchText = [
      ticket.codigo, ticket.titulo, ticket.cliente_nome, ticket.cliente_email,
      ticket.tecnico_nome, ticket.categoria,
    ].join(" ").toLowerCase();
    return matchesStatus && matchesPriority && matchesAssignee &&
      searchText.includes(query.trim().toLowerCase());
  }), [tickets, filter, priorityFilter, assigneeFilter, query]);

  function updateDraft(ticketId, patch) {
    setDrafts(current => ({ ...current, [ticketId]: { ...current[ticketId], ...patch } }));
  }

  async function update(ticket) {
    const draft = drafts[ticket.id] || {};
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await apiRequest(`/chamados/${ticket.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: draft.status ?? ticket.status,
          resposta: draft.resposta ?? ticket.resposta_tecnica ?? "",
          tecnico_id: draft.tecnico_id === undefined
            ? (ticket.tecnico_id ?? null)
            : (draft.tecnico_id === "" ? null : Number(draft.tecnico_id)),
        }),
      });
      setNotice(`Chamado ${ticket.codigo} atualizado com sucesso.`);
      setDrafts(current => {
        const next = { ...current };
        delete next[ticket.id];
        return next;
      });
      await load();
    } catch (updateError) {
      setError(updateError.message || "Não foi possível atualizar o chamado.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleHistory(ticket) {
    const opening = !expandedHistory[ticket.id];
    setExpandedHistory(current => ({ ...current, [ticket.id]: opening }));
    if (!opening || histories[ticket.id]) return;
    setHistoryLoading(current => ({ ...current, [ticket.id]: true }));
    try {
      const rows = await getTicketHistory(ticket.codigo);
      setHistories(current => ({ ...current, [ticket.id]: rows }));
    } catch (historyError) {
      setError(historyError.message || "Não foi possível carregar o histórico.");
    } finally {
      setHistoryLoading(current => ({ ...current, [ticket.id]: false }));
    }
  }

  const count = status => tickets.filter(ticket => ticket.status === status).length;

  return (
    <main className="tech-shell">
      <header className="tech-header">
        <div className="tech-brand">
          <span>G</span>
          <div><strong>G-TECH</strong><small>PAINEL TÉCNICO</small></div>
        </div>
        <div className="tech-user">
          <ShieldCheck size={17} />
          <span>{user?.nome || user?.name || "Técnico"}</span>
          <button onClick={onLogout} title="Sair" aria-label="Sair"><LogOut size={17} /></button>
        </div>
      </header>

      <section className="tech-content">
        <div className="tech-title">
          <div>
            <span className="eyebrow">CENTRAL DE OPERAÇÕES</span>
            <h1>Gestão de chamados</h1>
            <p>Organize a fila, atribua responsáveis e acompanhe cada atendimento.</p>
          </div>
          <button className="tech-refresh" onClick={load} disabled={busy}>
            <RefreshCw size={16} /> Atualizar
          </button>
        </div>

        <div className="tech-stats">
          <article><Ticket /><span>Total de chamados</span><strong>{tickets.length}</strong></article>
          <article><AlertCircle /><span>Aguardando</span><strong>{count("Aguardando atendimento")}</strong></article>
          <article><Clock3 /><span>Em atendimento</span><strong>{count("Em atendimento")}</strong></article>
          <article><CheckCircle2 /><span>Resolvidos</span><strong>{count("Resolvido")}</strong></article>
        </div>

        {error && <p className="tech-alert" role="alert">{error}</p>}
        {notice && <p className="tech-success" role="status">{notice}</p>}

        <section className="tech-panel">
          <div className="tech-tools tech-tools-expanded">
            <div className="tech-search">
              <Search size={17} />
              <input value={query} onChange={event => setQuery(event.target.value)}
                placeholder="Buscar protocolo, cliente, técnico ou categoria..." />
            </div>
            <select value={filter} onChange={event => setFilter(event.target.value)} aria-label="Filtrar por status">
              <option value="Todos">Todos os status</option>
              {statuses.map(status => <option key={status}>{status}</option>)}
            </select>
            <select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)} aria-label="Filtrar por prioridade">
              <option value="Todas">Todas as prioridades</option>
              {priorities.map(priority => <option key={priority}>{priority}</option>)}
            </select>
            <select value={assigneeFilter} onChange={event => setAssigneeFilter(event.target.value)} aria-label="Filtrar por responsável">
              <option value="Todos">Todos os responsáveis</option>
              <option value="sem_responsavel">Sem responsável</option>
              {technicians.map(technician => (
                <option key={technician.id} value={String(technician.id)}>{technician.nome}</option>
              ))}
            </select>
          </div>

          <div className="tech-results-label">
            Exibindo {filtered.length} de {tickets.length} chamado(s)
          </div>

          {busy && !tickets.length ? (
            <p className="tech-empty">Carregando chamados...</p>
          ) : filtered.length === 0 ? (
            <p className="tech-empty">Nenhum chamado encontrado com esses filtros.</p>
          ) : (
            <div className="tech-list">
              {filtered.map(ticket => {
                const draft = drafts[ticket.id] || {};
                const assigned = draft.tecnico_id === undefined
                  ? (ticket.tecnico_id ? String(ticket.tecnico_id) : "")
                  : draft.tecnico_id;
                return (
                  <article className="tech-ticket" key={ticket.id}>
                    <div className="tech-ticket-head">
                      <div>
                        <small>{ticket.codigo} · {new Date(ticket.criado_em).toLocaleString("pt-BR")}</small>
                        <h2>{ticket.titulo}</h2>
                        <p>{ticket.cliente_nome} · {ticket.cliente_email}</p>
                      </div>
                      <span className={`tech-priority priority-${String(ticket.prioridade).toLowerCase()}`}>
                        {ticket.prioridade}
                      </span>
                    </div>

                    <div className="tech-ticket-meta">
                      <span><UserRound size={14} /> Responsável: <strong>{ticket.tecnico_nome || "Não atribuído"}</strong></span>
                      <span>Categoria: <strong>{ticket.categoria}</strong></span>
                    </div>
                    <p className="tech-description">{ticket.descricao}</p>

                    <div className="tech-ticket-actions tech-ticket-actions-managed">
                      <label>
                        Status
                        <select value={draft.status ?? ticket.status}
                          onChange={event => updateDraft(ticket.id, { status: event.target.value })}>
                          {statuses.map(status => <option key={status}>{status}</option>)}
                        </select>
                      </label>
                      <label>
                        Técnico responsável
                        <select value={assigned}
                          onChange={event => updateDraft(ticket.id, { tecnico_id: event.target.value })}>
                          <option value="">Sem responsável</option>
                          {technicians.map(technician => (
                            <option key={technician.id} value={String(technician.id)}>{technician.nome}</option>
                          ))}
                        </select>
                      </label>
                      <label className="tech-reply">
                        Resposta ao cliente
                        <textarea rows="2" maxLength="3000"
                          value={draft.resposta ?? ticket.resposta_tecnica ?? ""}
                          onChange={event => updateDraft(ticket.id, { resposta: event.target.value })}
                          placeholder="Registre uma orientação ou solução..." />
                      </label>
                      <button onClick={() => update(ticket)} disabled={busy}>
                        <UserCheck size={15} /> Salvar alterações
                      </button>
                    </div>

                    <div className="tech-history-control">
                      <button type="button" onClick={() => toggleHistory(ticket)}>
                        <History size={15} /> {expandedHistory[ticket.id] ? "Ocultar histórico" : "Ver histórico"}
                        <ChevronDown size={15} className={expandedHistory[ticket.id] ? "is-rotated" : ""} />
                      </button>
                    </div>
                    {expandedHistory[ticket.id] && (
                      <div className="tech-history-list">
                        {historyLoading[ticket.id] ? <p>Carregando histórico...</p> :
                          (histories[ticket.id] || []).length ? histories[ticket.id].map(event => (
                            <div className="tech-history-event" key={event.id}>
                              <strong>{event.status_novo || event.mensagem}</strong>
                              {event.status_novo && <span>{event.mensagem}</span>}
                              <small>{event.autor_nome} · {new Date(event.criado_em).toLocaleString("pt-BR")}</small>
                            </div>
                          )) : <p>Nenhum evento disponível.</p>}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <p className="tech-foot"><ShieldCheck size={15} /> Área restrita. Atribuições, respostas e mudanças de status são registradas no histórico.</p>
      </section>
    </main>
  );
}
