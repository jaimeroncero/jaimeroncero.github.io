import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import perfilEjemplo from "../assets/perfil-generico.png";
import config from "../config";
import "./ChatPage.css";

export default function ChatPage() {
  const navigate = useNavigate();
  const usuarioId = parseInt(localStorage.getItem("usuario_id"), 10);
  const [conversaciones, setConversaciones] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    if (!usuarioId || isNaN(usuarioId)) {
      return navigate("/login");
    }
    fetch(`${config.backendUrl}/conversations/${usuarioId}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setConversaciones(arr);
        if (arr.length > 0) setActiveChat(arr[0].id);
      })
      .catch((err) => {
        console.error("Error fetching conversations:", err);
        setConversaciones([]);
      });
  }, [usuarioId, navigate]);

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="App">
      <Header title="Mis Chats" />
      <main className="form-page">
        <div className="chats-container">
          <div className="tabs-container">
            {conversaciones.map((c) => (
              <div
                key={c.id}
                className={`chat-tab ${activeChat === c.id ? "active" : ""}`}
                onClick={() => handleChatClick(c.id)}
              >
                <img
                  src={c.imagen || perfilEjemplo}
                  alt={c.name}
                  className="chat-tab-avatar"
                />
                <div className="chat-tab-info">
                  <span className="chat-tab-name">{c.name}</span>
                  <span className="chat-tab-preview">{c.ultimoMensaje}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-content">
            {conversaciones.length === 0 ? (
              <div className="no-chats">
                <p>No tienes conversaciones activas</p>
                <button className="btn" onClick={() => navigate("/nuevo-chat")}>
                  Iniciar nuevo chat
                </button>
              </div>
            ) : (
              <div className="chat-placeholder">
                <p>Selecciona una conversación para ver los mensajes</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
