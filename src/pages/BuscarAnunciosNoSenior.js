import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaListAlt, FaComments, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import handScroll from "../assets/hand-scroll.png";
import "./BuscarAnunciosNoSenior.css";
import ejemploImagen from "../assets/840_560.jpg"; // Añade esta línea


function BuscarAnunciosNoSenior() {
  const [query, setQuery] = useState("");
  const [showHint, setShowHint] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // 🔹 Datos simulados
  const anunciosMock = [
    {
      id: 1,
      titulo: "Tuppers de comida casera",
      descripcion: "Senior apasionada de la cocina, que ofrece tuppers de comida a jóvenes estudiantes.",
      precio: 15,
      multimedia: ejemploImagen,
    },
    {
      id: 2,
      titulo: "Servicio de fontanería",
      descripcion: "Reparaciones urgentes y mantenimiento en el hogar.",
      precio: 50,
      multimedia: "https://picsum.photos/800/1000?random=2",
    },
    {
      id: 3,
      titulo: "Cuidado de mayores a domicilio",
      descripcion: "Atención personalizada con experiencia en enfermería.",
      precio: 12,
      multimedia: "https://picsum.photos/800/1000?random=3",
    },
    {
      id: 4,
      titulo: "Clases de guitarra",
      descripcion: "Aprende a tocar desde cero o perfecciona tu técnica.",
      precio: 20,
      multimedia: "https://picsum.photos/800/1000?random=4",
    },
  ];

  // 🔎 Filtrado por búsqueda
  const anunciosFiltrados = anunciosMock.filter(
    (a) =>
      a.titulo.toLowerCase().includes(query.toLowerCase()) ||
      a.descripcion.toLowerCase().includes(query.toLowerCase())
  );

  // 👋 Ocultar hint tras 4s
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // 🔼 Subir anuncio
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // 🔽 Bajar anuncio
  const handleNext = () => {
    if (currentIndex < anunciosFiltrados.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="buscar-anuncios-page">
      {/* 🔹 Barra superior */}
      <div className="top-navbar">
        <img
          src={logo}
          alt="Logo Acción Senior"
          className="logo-navbar"
          onClick={() => navigate("/buscar-anuncios-no-senior")}
        />
        <div className="nav-icons">
          <FaUser
            className="nav-icon"
            title="Mi perfil"
            onClick={() => navigate("/mi-perfil-no-senior")}
          />
          <FaListAlt
            className="nav-icon"
            title="Mis anuncios"
            onClick={() => navigate("/mis-anuncios")}
          />
          <FaComments
            className="nav-icon"
            title="Chat"
            onClick={() => navigate("/chat")}
          />
        </div>
      </div>

      {/* 🔹 Barra de búsqueda */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentIndex(0); // reinicia al primer resultado
            }}
          />
        </div>
      </div>

      {/* 🔹 Mostrar solo el anuncio actual */}
      <div className="feed-container">
        {anunciosFiltrados.length > 0 ? (
          <div key={anunciosFiltrados[currentIndex].id} className="feed-card">
            <img
              src={anunciosFiltrados[currentIndex].multimedia}
              alt={anunciosFiltrados[currentIndex].titulo}
              className="feed-img"
            />
            <div className="feed-info">
              <h2>{anunciosFiltrados[currentIndex].titulo}</h2>
              <p>{anunciosFiltrados[currentIndex].descripcion}</p>
              <p className="precio">💰 {anunciosFiltrados[currentIndex].precio} €</p>
            </div>
          </div>
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No se encontraron anuncios
          </p>
        )}
      </div>

      {/* 🔹 Botones de navegación */}
      <div className="nav-buttons">
        <button onClick={handlePrev} disabled={currentIndex === 0}>
          <FaChevronUp />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === anunciosFiltrados.length - 1}
        >
          <FaChevronDown />
        </button>
      </div>

      {/* 🔹 Animación inicial */}
      {showHint && (
        <div className="scroll-hint">
          <img src={handScroll} alt="Desliza hacia abajo" />
          <p>Desliza para ver más anuncios</p>
        </div>
      )}
    </div>
  );
}

export default BuscarAnunciosNoSenior;
