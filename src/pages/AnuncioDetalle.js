import React, { useState, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Header from '../components/Header';
import './AnuncioDetalle.css';

function AnuncioDetalle() {
  const [isEditing, setIsEditing] = useState(false);
  const [titulo, setTitulo] = useState('Título del Anuncio');
  const [precio, setPrecio] = useState('Precio');
  const [descripcion, setDescripcion] = useState('Descripción detallada del anuncio.');
  const [multimedia, setMultimedia] = useState([]);
  const multimediaInputRef = useRef(null);

  const handleModifyClick = () => {
    setIsEditing(!isEditing);
  };

  const handleMultimediaClick = () => {
    if (isEditing) {
      multimediaInputRef.current.click();
    }
  };

  const handleMultimediaChange = (event) => {
    const files = Array.from(event.target.files);
    const newMultimedia = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setMultimedia(prev => [...prev, ...newMultimedia]);
  };

  return (
    <div className="anuncio-detalle-page">
      <Header title="Detalle del Anuncio" />
      <main className="anuncio-detalle-container">
        <div className="anuncio-detalle-form">
          <div className="form-group">
            <label htmlFor="titulo">Título del anuncio</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>
          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
              type="text"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              disabled={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>
          <div className="form-group">
            <label>Multimedia</label>
            <div 
              className={`multimedia-container ${isEditing ? 'editable' : ''} ${multimedia.length > 0 ? 'has-content' : ''}`}
              onClick={handleMultimediaClick}
            >
              {multimedia.length > 0 ? (
                <Carousel showThumbs={false} showStatus={false} infiniteLoop useKeyboardArrows>
                  {multimedia.map((media, index) => (
                    <div key={index} className="multimedia-item">
                      {media.type.startsWith('image/') ? (
                        <img src={media.url} alt={`media-${index}`} />
                      ) : (
                        <video src={media.url} controls />
                      )}
                    </div>
                  ))}
                </Carousel>
              ) : (
                isEditing && <p>Pulsa aquí para subir archivos multimedia de tu ordenador</p>
              )}
            </div>
            <input
              type="file"
              ref={multimediaInputRef}
              onChange={handleMultimediaChange}
              style={{ display: 'none' }}
              accept="image/*,video/*"
              multiple
              disabled={!isEditing}
            />
          </div>
          <button onClick={handleModifyClick} className={isEditing ? 'save-button' : 'modify-button'}>
            {isEditing ? 'Guardar' : 'Modificar'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default AnuncioDetalle;
