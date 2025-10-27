# src/models.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base, BaseChats  # Añadido BaseChats a los imports

class Usuario(Base):
    __tablename__ = "usuarios"
    id       = Column(Integer, primary_key=True, index=True)
    nombre   = Column(String, nullable=False)
    email    = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    perfil   = relationship("Perfil", back_populates="usuario", uselist=False)

class Perfil(Base):
    __tablename__ = "perfiles"
    id             = Column(Integer, primary_key=True, index=True)
    usuario_id     = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nombre_usuario = Column(String, nullable=False)
    foto_perfil    = Column(String, nullable=True)   # URL/base64 de la foto
    descripcion    = Column(String, nullable=True)   # Texto de presentación
    multimedia     = Column(String, nullable=True)   # Lista de URLs (separadas por comas)
    usuario        = relationship("Usuario", back_populates="perfil")

class Anuncio(Base):
    __tablename__ = "anuncios"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    titulo = Column(String, nullable=False)
    precio = Column(Float, nullable=False)
    descripcion = Column(String, nullable=False)
    multimedia = Column(String)  # Puede ser JSON (string) para URLs de archivos

class Message(BaseChats):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, nullable=False)  # Removido ForeignKey
    receiver_id = Column(Integer, nullable=False)  # Removido ForeignKey
    body = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Removidas las relaciones ya que están en otra base de datos
    # sender = relationship("Usuario", foreign_keys=[sender_id])
    # receiver = relationship("Usuario", foreign_keys=[receiver_id])
