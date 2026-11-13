
import React, { useEffect, useState } from 'react';

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate
} from 'react-router-dom';
import SupportDashboard from '../../frontend_suporte/SupportDashboard.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tickets from './pages/Tickets.jsx';
import NewTicket from './pages/NewTicket.jsx';
import TicketDetails from './pages/TicketDetails.jsx';
import Profile from './pages/Profile.jsx';

import {
  clearSession,
  createTicket,
  getSession,
  getTickets,
  saveSession,
  saveTickets,
  updateProfile
} from './services/api.js';

function ProtectedLayout({
  user,
  tickets,
  onLogout,
  onCreate,
  onSaveProfile
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={onLogout}
      />

      <main className="main-area">
        <Topbar
          user={user}
          onMenu={() => setMenuOpen(true)}
        />

        <div className="page-content">
     
<Routes>

  {/* Dashboard do suporte */}
  <Route
    path="/suporte"
    element={<SupportDashboard />}
  />

  {/* Dashboard do cliente */}
  <Route
    path="/painel"
    element={<Dashboard tickets={tickets} user={user} />}
  />

  {/* Lista de chamados */}
  <Route
    path="/chamados"
    element={<Tickets tickets={tickets} />}
  />

  {/* Detalhes do chamado */}
  <Route
    path="/chamados/:id"
    element={<TicketDetails tickets={tickets} />}
  />

  {/* Novo chamado */}
  <Route
    path="/novo-chamado"
    element={<NewTicket onCreate={onCreate} />}
  />

  {/* Perfil */}
  <Route
    path="/perfil"
    element={
      <Profile
        user={user}
        onSave={onSaveProfile}
      />
    }
  />

  {/* Rota padrão - sempre por último */}
  <Route
    path="*"
    element={<Navigate to="/painel" replace />}
  />

</Routes>

        </div>

        <footer className="app-footer">
          <span>
            © {new Date().getFullYear()} G-TECH.
            Todos os direitos reservados.
          </span>

          <span>
            PORTAL DO CLIENTE <i />
          </span>
        </footer>
      </main>
    </div>
  );
}

function AppContent() {
  const [user, setUser] = useState(() => getSession());
  const [tickets, setTickets] = useState(() => getTickets());

  const navigate = useNavigate();

  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  function login(profile) {
    saveSession(profile);
    setUser(profile);
    navigate('/painel');
  }

  function logout() {
    clearSession();
    setUser(null);
    navigate('/');
  }

  async function addTicket(data) {
    const ticket = await createTicket(data, user);
    setTickets(current => [ticket, ...current]);
  }

  function saveProfile(data) {
    updateProfile(data);
    setUser(current => ({ ...current, ...data }));
  }

  if (!user) {
    return (
      <Routes>
        <Route
          path="*"
          element={<Login onLogin={login} />}
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="*"
        element={
          <ProtectedLayout
            user={user}
            tickets={tickets}
            onLogout={logout}
            onCreate={addTicket}
            onSaveProfile={saveProfile}
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
