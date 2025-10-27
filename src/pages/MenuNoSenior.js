import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import btnMisAnuncios from '../assets/btnMisAnuncios.jpg';
import btnChat from '../assets/btnChat.jpg';
import btnPerfil from '../assets/btnPerfil.jpg';
import btnBuscar from '../assets/btnBuscar.jpg';

function MenuNoSenior() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <Header title="Menú" />
      <main className="form-page">
        
        <div className="menu-grid">
          <button className="btn btn-mis-anuncios" onClick={() => navigate('/mis-anuncios')}>
            Mis anuncios
          </button>
          <button className="btn btn-chat" onClick={() => navigate('/chat')}>
            Chat
          </button>
          <button className="btn btn-perfil" onClick={() => navigate('/mi-perfil-no-senior')}>
            Mi perfil
          </button>
          <button className="btn btn-buscar" onClick={() => navigate('/buscar')}>
            Buscar
          </button>
        </div>
      </main>
    </div>
  );
}

export default MenuNoSenior;
