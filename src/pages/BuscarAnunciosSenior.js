import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import handScroll from "../assets/hand-scroll.png";
import ejemploImagen from "../assets/Captura.JPG"; // Añade esta línea
import "./BuscarAnunciosNoSenior.css";
import Header from "../components/Header";

function BuscarAnunciosSenior() {
  const [query, setQuery] = useState("");
  const [showHint, setShowHint] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // 🔹 Datos simulados (mock)
  const anunciosMock = [
    {
      id: 1,
      titulo: "Clases informática para seniors.",
      descripcion: "Estudiante apasionado de la tecnología que ofrece clases de informatica a jubilados.",
      precio: 15,
      multimedia: ejemploImagen,
    },
    {
      id: 2,
      titulo: "Servicio de fisioterapia a domicilio",
      descripcion: "Atención personalizada en la comodidad de tu hogar.",
      precio: 25,
      multimedia: "https://picsum.photos/800/1000?random=11",
    },
    {
      id: 3,
      titulo: "Clases de informática básica",
      descripcion: "Aprende a usar el móvil y el ordenador desde cero.",
      precio: 15,
      multimedia: "https://picsum.photos/800/1000?random=12",
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
      {/* 🔹 Cabecera igual que MenuSenior */}
      <Header title="Buscar Anuncios" />

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
              setCurrentIndex(0);
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
              <p className="precio">
                💰 {anunciosFiltrados[currentIndex].precio} €
              </p>
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

export default BuscarAnunciosSenior;
