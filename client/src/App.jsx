import React,{useEffect,useState} from "react";
import {BrowserRouter,Navigate,Route,Routes,useNavigate} from "react-router-dom";
import "./styles/technician.css";
import "./styles/ticket-success.css";
import Sidebar from "./components/Sidebar.jsx";import Topbar from "./components/Topbar.jsx";
import Login from "./pages/Login.jsx";import Dashboard from "./pages/Dashboard.jsx";import Tickets from "./pages/Tickets.jsx";import NewTicket from "./pages/NewTicket.jsx";import TicketDetails from "./pages/TicketDetails.jsx";import Profile from "./pages/Profile.jsx";import TechnicianDashboard from "./pages/TechnicianDashboard.jsx";import AdminDashboard from "./pages/AdminDashboard.jsx";import TicketSuccess from "./pages/TicketSuccess.jsx";
import {apiRequest,clearSession,createTicket,getSession,getTickets,login as authenticate,logout as endSession,restoreSession,saveSession} from "./services/api.js";
function CustomerLayout({user,tickets,onLogout,onCreate,onSave}){const [menu,setMenu]=useState(false);return <div className="app-layout"><Sidebar user={user} open={menu} onClose={()=>setMenu(false)} onLogout={onLogout}/><main className="main-area"><Topbar user={user} onMenu={()=>setMenu(true)}/><div className="page-content"><Routes><Route path="/painel" element={<Dashboard tickets={tickets} user={user}/>}/><Route path="/chamados" element={<Tickets tickets={tickets}/>}/><Route path="/chamado-sucesso/:id" element={<TicketSuccess tickets={tickets}/>}/><Route path="/chamados/:id" element={<TicketDetails tickets={tickets}/>}/><Route path="/novo-chamado" element={<NewTicket onCreate={onCreate}/>}/><Route path="/perfil" element={<Profile user={user} onSave={onSave}/>}/><Route path="*" element={<Navigate to="/painel" replace/>}/></Routes></div><footer className="app-footer">© {new Date().getFullYear()} G-TECH. Todos os direitos reservados.</footer></main></div>}
function Content(){const [user,setUser]=useState(null),[tickets,setTickets]=useState([]),[ready,setReady]=useState(false),navigate=useNavigate();
useEffect(()=>{let active=true;restoreSession().then(u=>{if(active)setUser(u)}).catch(()=>{clearSession()}).finally(()=>{if(active)setReady(true)});return()=>{active=false}},[]);
useEffect(()=>{if(user?.perfil!=="cliente")return;let active=true;const load=()=>getTickets().then(rows=>{if(active)setTickets(rows)}).catch(()=>{});load();const timer=setInterval(load,15000);return()=>{active=false;clearInterval(timer)}},[user]);
async function onLogin(u){saveSession(u);setUser(u);navigate(u.perfil==="admin"?"/admin":u.perfil==="tecnico"?"/tecnico":"/painel")}
async function onLogout(){await endSession();setUser(null);setTickets([]);navigate("/")}
async function onCreate(data){const t=await createTicket(data);setTickets(x=>[t,...x]);return t;}
function onSave(){return;}
if(!ready)return <div className="auth-form-area">Carregando sessão segura...</div>;
if(!user)return <Routes><Route path="*" element={<Login onLogin={onLogin}/>}/></Routes>;
if(user.perfil==="admin")return <Routes><Route path="/admin" element={<AdminDashboard user={user} onLogout={onLogout}/>}/><Route path="*" element={<Navigate to="/admin" replace/>}/></Routes>;
if(user.perfil==="tecnico")return <Routes><Route path="/tecnico" element={<TechnicianDashboard user={user} onLogout={onLogout}/>}/><Route path="*" element={<Navigate to="/tecnico" replace/>}/></Routes>;
return <Routes><Route path="*" element={<CustomerLayout user={user} tickets={tickets} onLogout={onLogout} onCreate={onCreate} onSave={onSave}/>}/></Routes>}
export default function App(){return <BrowserRouter><Content/></BrowserRouter>}