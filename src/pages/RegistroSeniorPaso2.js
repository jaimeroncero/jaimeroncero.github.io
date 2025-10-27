import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.jpg";
import config from "../config";

function RegistroSeniorPaso2() {
  const location = useLocation();
  const navigate = useNavigate();
  const { nombre, email } = location.state || {};
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegister = async () => {
    if (password !== confirmar) {
      setMensaje("❌ Las contraseñas no coinciden");
      return;
    }

    const datos = {
      usuario: { nombre, email, password, confirmar_password: confirmar },
      perfil: { nombre_usuario: nombre },
    };

    try {
      const res = await fetch(`${config.backendUrl}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Error");

      // Guardamos el usuario_id en localStorage
      localStorage.setItem("usuario_id", json.user_id);

      setMensaje("✅ Registrado correctamente");
      // Redirigir directamente al menú Senior
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
        <h2>Registro - Paso 2</h2>
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          placeholder="Confirmar contraseña"
          type="password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />
        <button className="btn" onClick={handleRegister}>
          Registrarme
        </button>
        {mensaje && <p>{mensaje}</p>}
      </main>
    </div>
  );
}

export default RegistroSeniorPaso2;
