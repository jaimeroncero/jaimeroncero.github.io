import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './misAnunciosNoSenior.css';

function MisAnunciosNoSenior() {
  const navigate = useNavigate();
  // Datos de ejemplo para los anuncios
  const anuncios = [
    { id: 1, titulo: 'Anuncio 1' },
  ];

  const handleAnuncioClick = (id) => {
    navigate(`/anuncio/${id}`);
  };

  return (
    <div className="mis-anuncios-page">
      <Header title="Mis Anuncios" />
      <main className="anuncios-grid-container">
        {anuncios.map(anuncio => (
          <button key={anuncio.id} className="anuncio-preview" onClick={() => handleAnuncioClick(anuncio.id)}>
            <div className="anuncio-content-wrapper">
              {/* Aquí se podría mostrar una imagen o más detalles */}
            </div>
            <p>{anuncio.titulo}</p>
          </button>
        ))}
        <button className="anuncio-preview nuevo-anuncio">
          <div className="anuncio-content-wrapper">
            <span className="plus-icon">+</span>
          </div>
          <p>Nuevo anuncio</p>
        </button>
      </main>
    </div>
  );
}

export default MisAnunciosNoSenior;
