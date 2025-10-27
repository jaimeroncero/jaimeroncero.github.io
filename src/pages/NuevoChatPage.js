import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import perfilEjemplo from "../assets/perfil-generico.png";
import config from "../config";
import "./NuevoChatPage.css";

export default function NuevoChatPage() {
  const navigate = useNavigate();
  const usuarioId = parseInt(localStorage.getItem("usuario_id"), 10);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("usuario_id");
    console.log("ID almacenado:", storedUserId);
    
    if (!usuarioId || isNaN(usuarioId)) {
      console.log("ID de usuario no válido, redirigiendo...");
      return navigate("/login");
    }
    
    console.log("Haciendo fetch del roster para usuario ID:", usuarioId);
    fetch(`${config.backendUrl}/roster/${usuarioId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos del roster:", data);
        const arr = Array.isArray(data) ? data : [];
        setUsuarios(arr);
      })
      .catch((err) => {
        console.error("Error fetching roster:", err);
        setUsuarios([]);
      });
  }, [usuarioId, navigate]);

  const iniciarChat = (otherId) => {
    console.log("Iniciando chat con usuario ID:", otherId);
    // For now, just navigate. A more robust solution would be to
    // create the conversation here if it doesn't exist.
    navigate(`/chat/${otherId}`);
  };

  return (
    <div className="App">
      <Header title="Nuevo Chat" />
      <main className="form-page">
        {usuarios.length === 0 ? (
          <p>No hay otros usuarios registrados.</p>
        ) : (
          <div className="usuarios-list">
            {usuarios.map((u) => (
              <div
                key={u.id}
                className="usuario-item"
                onClick={() => iniciarChat(u.id)}
              >
                <img
                  src={u.imagen || perfilEjemplo}
                  alt={u.name}
                  className="usuario-avatar"
                />
                <span className="usuario-name">{u.name}</span>
              </div>
            ))}
          </div>
        )}
        <button className="btn" onClick={() => navigate("/chats")}>
          ← Volver
        </button>
      </main>
    </div>
  );
}