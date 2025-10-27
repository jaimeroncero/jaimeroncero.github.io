import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import config from "../config";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${config.backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Error desconocido");

      // ✅ Guardar toda la info del usuario en localStorage
      localStorage.setItem("usuario_id", json.user_id);
      localStorage.setItem("usuario_nombre", json.nombre);
      localStorage.setItem("usuario_email", json.email);
      if (json.foto) localStorage.setItem("usuario_foto", json.foto);

      setMensaje("✅ Inicio de sesión correcto");
      navigate("/buscar-anuncios-no-senior");
    } catch (err) {
      setMensaje("❌ " + err.message);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="Logo Acción Senior" className="logo" />
      </header>
      <main className="form-page">
        <h2>Iniciar sesión</h2>
        <input
          placeholder="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" onClick={handleLogin}>
          Entrar
        </button>
        {mensaje && <p>{mensaje}</p>}
        <p>
          ¿No tienes cuenta?{" "}
          <span
            onClick={() => navigate("/registro")}
            style={{ cursor: "pointer", color: "#FFA424" }}
          >
            Regístrate
          </span>
        </p>
      </main>
    </div>
  );
}

export default LoginPage;
