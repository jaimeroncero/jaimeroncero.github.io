import './App.css';
import logo from './assets/logo.jpg';
import seniorBg from './assets/senior.png';
import noSeniorBg from './assets/NoSenior.png';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SeniorLandingPage from './pages/SeniorLandingPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import LoginSeniorPaso1 from './pages/LoginSeniorPaso1';
import LoginSeniorPaso2 from './pages/LoginSeniorPaso2';
import RegistroSeniorPaso1 from './pages/RegistroSeniorPaso1';
import RegistroSeniorPaso2 from './pages/RegistroSeniorPaso2';
import MenuNoSenior from './pages/MenuNoSenior';
import MenuSenior from './pages/MenuSenior';
import MiPerfilNoSenior from './pages/miPerfilNoSenior';
import MisAnunciosNoSenior from './pages/misAnunciosNoSenior';
import AnuncioDetalle from './pages/AnuncioDetalle';
import Chat from './pages/ChatPage';
import ChatConversacion from './pages/ChatConversacion';
import NuevoChatPage from './pages/NuevoChatPage';
import BuscarAnunciosNoSenior from './pages/BuscarAnunciosNoSenior';
import BuscarAnunciosSenior from './pages/BuscarAnunciosSenior';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="Logo Acción Senior" className="logo" />
      </header>

      <main className="split-screen">
        <div className="left" style={{ backgroundImage: `url(${seniorBg})` }}>
          <div className="overlay">
            <h2>¿Eres Senior?</h2>
            <button className="btn senior-btn" style={{ backgroundColor: 'orange' }} onClick={() => navigate('/senior')}>
               Entrar 
            </button>
          </div>
        </div>
        <div className="right" style={{ backgroundImage: `url(${noSeniorBg})` }}>
          <div className="overlay">
            <h2>¿No eres Senior?</h2>
            <button className="btn no-senior-btn" style={{ backgroundColor: '#90EE90' }} onClick={() => navigate('/login')}>
              Entrar 
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/senior" element={<SeniorLandingPage />} />
        <Route path="/login-senior-paso-1" element={<LoginSeniorPaso1 />} />
        <Route path="/login-senior-paso-2" element={<LoginSeniorPaso2 />} />
        <Route path="/registro-senior" element={<RegistroSeniorPaso1 />} />
        <Route path="/registro-senior-paso-2" element={<RegistroSeniorPaso2 />} />
        <Route path="/menu-no-senior" element={<MenuNoSenior />} />
        <Route path="/menu-senior" element={<MenuSenior />} />
        <Route path="/mi-perfil-no-senior" element={<MiPerfilNoSenior />} />
        <Route path="/mis-anuncios" element={<MisAnunciosNoSenior />} />
        <Route path="/anuncio/:id" element={<AnuncioDetalle />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:chatId" element={<ChatConversacion />} />
        <Route path="/nuevo-chat" element={<NuevoChatPage />} />
        <Route path="/buscar-anuncios-no-senior" element={<BuscarAnunciosNoSenior />} />
        <Route path="/buscar-anuncios-senior" element={<BuscarAnunciosSenior />} /> 
      </Routes>
    </Router>
  );
}

export default App;
