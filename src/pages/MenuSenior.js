import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function MenuSenior() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <Header title="Menú" />
      <main className="form-page">
        <div className="menu-grid">
          <button
            className="btn btn-menu btn-mis-anuncios"
            onClick={() => navigate("/mis-anuncios")}
          >
            Mis anuncios
          </button>

          <button
            className="btn btn-menu btn-chat"
            onClick={() => navigate("/chat")}
          >
            Chat
          </button>

          <button
            className="btn btn-menu btn-perfil"
            onClick={() => navigate("/mi-perfil-senior")}
          >
            Mi perfil
          </button>

          <button
            className="btn btn-menu btn-buscar"
            onClick={() => navigate("/buscar-anuncios-senior")}
          >
            Buscar
          </button>
        </div>
      </main>
    </div>
  );
}

export default MenuSenior;
