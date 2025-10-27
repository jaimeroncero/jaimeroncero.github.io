import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import fondoLogin from "../assets/IniciarSesion.png";      // Imagen de fondo para iniciar sesión
import fondoRegistro from "../assets/Registro.png"; // Imagen de fondo para registrarse

function SeniorLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="Logo Acción Senior" className="logo" />
      </header>

      <main className="split-screen">
        <div className="left" style={{ backgroundImage: `url(${fondoLogin})` }}>
          <div className="overlay">
            <h2>¿Tienes cuenta?</h2>
            <button 
            className="btn senior-btn" 
            onClick={() => navigate('/login-senior-paso-1')}  // Cambiar a login-senior-paso-1
            style={{ backgroundColor: '#FFA424' }}
            >
             Iniciar sesión
            </button>
          </div>
        </div>
        <div className="right" style={{ backgroundImage: `url(${fondoRegistro})` }}>
          <div className="overlay">
            <h2>¿No tienes cuenta?</h2>
            <button 
              className="btn no-senior-btn" 
              onClick={() => navigate('/registro-senior')}
              style={{ backgroundColor: '#6abf69' }}
            >
              Registrarse
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SeniorLandingPage;
