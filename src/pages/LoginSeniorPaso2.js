import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.jpg";
import config from "../config";

function LoginSeniorPaso2() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`${config.backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Error");

      // ✅ Guardar toda la info del usuario en localStorage
      localStorage.setItem("usuario_id", json.user_id);
      localStorage.setItem("usuario_nombre", json.nombre);
      localStorage.setItem("usuario_email", json.email);
      if (json.foto) localStorage.setItem("usuario_foto", json.foto);

      setMensaje("✅ Inicio de sesión correcto");
      // 👉 Llevar al menú principal de seniors
      navigate("/menu-senior");
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
        <h2>Introduce tu contraseña</h2>
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" onClick={handleLogin}>
          Iniciar sesión
        </button>
        {mensaje && <p>{mensaje}</p>}
      </main>
    </div>
  );
}

export default LoginSeniorPaso2;
