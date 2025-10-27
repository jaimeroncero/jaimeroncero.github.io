// src/pages/RegistroPage.js
import { useState } from "react";
import logo from "../assets/logo.jpg";
import config from "../config";

function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!nombre || !email || !password || !confirmar) {
        setMensaje("❌ Por favor completa todos los campos");
        return;
    }

    if (password !== confirmar) {
        setMensaje("❌ Las contraseñas no coinciden");
        return;
    }

    const body = {
        usuario: { 
            nombre, 
            email, 
            password, 
            confirmar_password: confirmar 
        },
        perfil: { 
            nombre_usuario: nombre 
        }
    };

    try {
        const res = await fetch(`${config.backendUrl}/registro`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "Error en el registro");
        }

        setMensaje(`✅ Usuario registrado correctamente`);
        // Limpiar el formulario
        setNombre("");
        setEmail("");
        setPassword("");
        setConfirmar("");
        
    } catch (err) {
        setMensaje(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="Logo Acción Senior" className="logo" />
      </header>
      <main className="form-page">
        <h2>Registro</h2>
        <input
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
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
        <input
          placeholder="Confirmar contraseña"
          type="password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />
        <button className="btn" onClick={handleSubmit}>
          Registrarme
        </button>
        {mensaje && <p>{mensaje}</p>}
      </main>
    </div>
  );
}

export default RegistroPage;
