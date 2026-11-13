
import React, { useState } from "react";

import {
  LayoutDashboard,
  Ticket,
  Clock,
  CheckCircle,
  Bell,
  Search,
  Headset,
  LogOut
} from "lucide-react";

import "./SupportDashboard.css";

export default function SupportDashboard({
  tickets = [],
  onLogout
}) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [search, setSearch] = useState("");

  // Menu lateral
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Todos os chamados", icon: Ticket },
    { name: "Aguardando atendimento", icon: Clock },
    { name: "Em atendimento", icon: Clock },
    { name: "Resolvidos", icon: CheckCircle }
  ];

  // Verifica o status do chamado
  const isPending = (status) =>
    ["pendente", "aguardando atendimento"].includes(
      (status || "").toLowerCase()
    );

  const isInProgress = (status) =>
    (status || "").toLowerCase() === "em atendimento";

  const isResolved = (status) =>
    ["resolvido", "resolvidos"].includes(
      (status || "").toLowerCase()
    );

  // Filtra os chamados
  const chamadosExibidos = tickets.filter((chamado) => {
    const termo = search.toLowerCase();

    const correspondePesquisa =
      (chamado.title || "").toLowerCase().includes(termo) ||
      (chamado.id || "").toLowerCase().includes(termo) ||
      (chamado.category || "").toLowerCase().includes(termo);

    let correspondeStatus = true;

    if (activeMenu === "Aguardando atendimento") {
      correspondeStatus = isPending(chamado.status);
    }

    if (activeMenu === "Em atendimento") {
      correspondeStatus = isInProgress(chamado.status);
    }

    if (activeMenu === "Resolvidos") {
      correspondeStatus = isResolved(chamado.status);
    }

    return correspondePesquisa && correspondeStatus;
  });

  return (
    <div className="support-layout">

      {/* MENU LATERAL */}
      <aside className="support-sidebar">

        <div className="support-logo">
          <Headset size={28} />

          <div>
            <h2>G-TECH</h2>
            <span>SUPORTE</span>
          </div>
        </div>

        <p className="menu-title">MENU PRINCIPAL</p>

        <nav>
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={
                  activeMenu === item.name
                    ? "menu-item active"
                    : "menu-item"
                }
                onClick={() => setActiveMenu(item.name)}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          <LogOut size={19} />
          Sair
        </button>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="support-main">

        <header className="support-header">

          <div>
            <h1>{activeMenu}</h1>
            <p>
              Painel de gerenciamento de suporte técnico
            </p>
          </div>

          <div className="support-profile">
            <Bell size={21} />

            <div className="profile-avatar">
              S
            </div>

            <span>Suporte</span>
          </div>

        </header>

        {/* INDICADORES */}
        <section className="dashboard-cards">

          <div className="dashboard-card">
            <Ticket />

            <h2>{tickets.length}</h2>

            <p>Total de chamados</p>
          </div>

          <div className="dashboard-card">
            <Clock />

            <h2>
              {tickets.filter(c => isPending(c.status)).length}
            </h2>

            <p>Aguardando atendimento</p>
          </div>

          <div className="dashboard-card">
            <Bell />

            <h2>
              {tickets.filter(c => isInProgress(c.status)).length}
            </h2>

            <p>Em atendimento</p>
          </div>

          <div className="dashboard-card">
            <CheckCircle />

            <h2>
              {tickets.filter(c => isResolved(c.status)).length}
            </h2>

            <p>Resolvidos</p>
          </div>

        </section>

        {/* TABELA DE CHAMADOS */}
        <section className="tickets-section">

          <div className="tickets-heading">

            <div>
              <h2>Chamados recebidos</h2>

              <p>
                Acompanhe as solicitações dos clientes.
              </p>
            </div>

            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Pesquisar chamado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Identificação</th>
                  <th>Solicitação</th>
                  <th>Categoria</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {chamadosExibidos.length > 0 ? (

                  chamadosExibidos.map((chamado) => (

                    <tr key={chamado.id}>

                      <td>{chamado.id}</td>

                      <td>{chamado.title}</td>

                      <td>{chamado.category}</td>

                      <td>{chamado.priority}</td>

                      <td>
                        <span className="status-label">
                          {chamado.status}
                        </span>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="5">
                      Nenhum chamado encontrado.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}
