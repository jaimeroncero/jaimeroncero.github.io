import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import config from "../config";

function MiPerfilNoSenior() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [originalProfileImage, setOriginalProfileImage] = useState(null);
  const [multimedia, setMultimedia] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const fileInputRef = useRef(null);
  const multimediaInputRef = useRef(null);
  const imgRef = useRef(null);

  // cargar datos desde backend
  useEffect(() => {
    const fetchPerfil = async () => {
      const usuario_id = localStorage.getItem("usuario_id");
      if (!usuario_id) return navigate("/login");

      const res = await fetch(`${config.backendUrl}/perfil/${usuario_id}`);
      if (res.ok) {
        const data = await res.json();
        setNombre(data.nombre_usuario || "");
        setDescripcion(data.descripcion || "");
        setProfileImage(data.foto_perfil || null);
        setMultimedia(data.multimedia || []);
      }
    };
    fetchPerfil();
  }, [navigate]);

  const handleImageClick = () => {
    if (profileImage) {
      setImageSrc(originalProfileImage);
      setShowCropModal(true);
    } else {
      fileInputRef.current.click();
    }
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const result = reader.result;
        setImageSrc(result);
        setOriginalProfileImage(result);
      });
      reader.readAsDataURL(e.target.files[0]); // ya devuelve base64
      setShowCropModal(true);
    }
  };

  const handleMultimediaClick = () => {
    multimediaInputRef.current.click();
  };

  const handleMultimediaChange = (event) => {
    const files = Array.from(event.target.files);
    const newMultimedia = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setMultimedia((prev) => [...prev, ...newMultimedia]);
  };

  // generar base64 del recorte
  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      resolve(canvas.toDataURL("image/png")); // devuelve base64
    });
  };

  // ...existing code...

// ...existing code...

const handleCropSave = async () => {
  if (completedCrop?.width && completedCrop?.height && imgRef.current) {
    try {
      const croppedImageBase64 = await getCroppedImg(
        imgRef.current,
        completedCrop
      );

      // Guardar en el backend primero
      const usuario_id = localStorage.getItem("usuario_id");
      const body = {
        nombre_usuario: nombre,
        descripcion: descripcion,
        foto_perfil: croppedImageBase64,
        multimedia: multimedia.map(m => m.url)
      };

      const res = await fetch(`${config.backendUrl}/perfil/${usuario_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error("Error al actualizar la foto de perfil");
      }

      // Si el guardado fue exitoso, actualizamos el estado local
      setProfileImage(croppedImageBase64);
      setOriginalProfileImage(croppedImageBase64);
      setShowCropModal(false);
      alert("✅ Imagen actualizada correctamente");

    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error al guardar la imagen: " + err.message);
    }
  } else {
    alert("❌ Por favor, selecciona un área para recortar");
  }
};

// ...existing code...

// ...existing code...

  // guardar en backend
  const handleSave = async () => {
    const usuario_id = localStorage.getItem("usuario_id");
    const body = {
      nombre,
      puesto,
      descripcion,
      foto_perfil: profileImage, // base64
      multimedia: multimedia.map((m) => m.url),
    };

    try {
      const res = await fetch(`${config.backendUrl}/perfil/${usuario_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al guardar perfil");
      alert("✅ Perfil guardado correctamente");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="App">
      <Header title="Mi Perfil" />
      <main className="form-page">
        <div className="profile-container">
          {showCropModal && (
            <div className="modal">
              <div className="modal-content">
                {imageSrc && (
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                  >
                    <img ref={imgRef} src={imageSrc} alt="Source" />
                  </ReactCrop>
                )}
                <button onClick={handleCropSave}>Guardar Recorte</button>
                <button onClick={() => setShowCropModal(false)}>Cancelar</button>
                <p>O sube una nueva imagen:</p>
                <button onClick={() => fileInputRef.current.click()}>
                  Subir otra imagen
                </button>
              </div>
            </div>
          )}
          <div className="profile-header">
            <div className="profile-pic-container" onClick={handleImageClick}>
              {profileImage ? (
                <img src={profileImage} alt="Perfil" className="profile-pic" />
              ) : (
                <div className="profile-pic-placeholder"></div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={onSelectFile}
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>
            <div className="profile-info">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="profile-name-input"
              />
              <input
                type="text"
                value={puesto}
                onChange={(e) => setPuesto(e.target.value)}
                className="profile-puesto-input"
              />
            </div>
          </div>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="profile-description-textarea"
          />
          <div className="multimedia-section" onClick={handleMultimediaClick}>
            <h3>Multimedia</h3>
            <div className="multimedia-grid">
              {multimedia.map((media, index) => (
                <div key={index} className="multimedia-item">
                  {media.type && media.type.startsWith("image/") ? (
                    <img src={media.url} alt={`media-${index}`} />
                  ) : (
                    <video src={media.url} controls />
                  )}
                </div>
              ))}
            </div>
            <input
              type="file"
              ref={multimediaInputRef}
              onChange={handleMultimediaChange}
              style={{ display: "none" }}
              accept="image/*,video/*"
              multiple
            />
          </div>
          <button className="btn login-btn" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </main>
    </div>
  );
}

export default MiPerfilNoSenior;