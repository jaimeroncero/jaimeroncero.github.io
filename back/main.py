# back/main.py
from fastapi import FastAPI, HTTPException, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime

from database import BaseChats, get_db, get_db_chats, Base, engine, engine_chats
from models import Usuario, Perfil, Anuncio, Message   # 👈 asegúrate de tenerlo en models.py

# Crear tablas - Primero la base de datos principal
Base.metadata.create_all(bind=engine)

# Luego la base de datos de chats
BaseChats.metadata.create_all(bind=engine_chats)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Restringir en producción
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

# --------- Schemas ----------
class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    confirmar_password: str

class PerfilCreate(BaseModel):
    nombre_usuario: str

class RegistroRequest(BaseModel):
    usuario: UsuarioCreate
    perfil: PerfilCreate

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    user_id: int

class PerfilUpdate(BaseModel):
    nombre: Optional[str] = None
    puesto: Optional[str] = None
    descripcion: Optional[str] = None
    foto_perfil: Optional[str] = None
    multimedia: Optional[List[str]] = None

class AnuncioCreate(BaseModel):
    titulo: str
    precio: float
    descripcion: str
    multimedia: Optional[str] = None  # Puede ser string de URLs separadas por comas o JSON

class AnuncioOut(AnuncioCreate):
    id: int
    usuario_id: int
    class Config:
        orm_mode = True

class MessageCreate(BaseModel):
    sender_id: int
    receiver_id: int
    body: str

class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    body: str
    timestamp: datetime

    class Config:
        orm_mode = True

class UserInfo(BaseModel):
    id: int
    name: str
    imagen: Optional[str] = None


# --------- Endpoints ----------
@app.post("/chats/send", response_model=MessageOut)
def send_message(msg: MessageCreate, db: Session = Depends(get_db), db_chats: Session = Depends(get_db_chats)):
    # Verificar que ambos usuarios existen
    sender = db.query(Usuario).filter_by(id=msg.sender_id).first()
    receiver = db.query(Usuario).filter_by(id=msg.receiver_id).first()
    
    if not sender or not receiver:
        raise HTTPException(404, "Usuario no encontrado")

    message = Message(
        sender_id=msg.sender_id,
        receiver_id=msg.receiver_id,
        body=msg.body,
    )
    db_chats.add(message)
    db_chats.commit()
    db_chats.refresh(message)
    return message

@app.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter_by(email=req.email, password=req.password).first()
    if not user:
        raise HTTPException(401, "Email o contraseña incorrectos")
    return {"user_id": user.id}

@app.get("/perfil/{user_id}")
def get_perfil(user_id: int, db: Session = Depends(get_db)):
    perfil = db.query(Perfil).filter_by(usuario_id=user_id).first()
    if not perfil:
        raise HTTPException(404, "Perfil no encontrado")
    return {
        "nombre_usuario": perfil.nombre_usuario,
        "foto_perfil": perfil.foto_perfil,
        "descripcion": perfil.descripcion,
        "multimedia": perfil.multimedia.split(",") if perfil.multimedia else []
    }

@app.put("/perfil/{user_id}")
def update_perfil(user_id: int, data: PerfilUpdate, db: Session = Depends(get_db)):
    perfil = db.query(Perfil).filter_by(usuario_id=user_id).first()
    if not perfil:
        raise HTTPException(404, "Perfil no encontrado")

    if data.nombre: perfil.nombre_usuario = data.nombre
    if data.descripcion: perfil.descripcion = data.descripcion
    if data.foto_perfil: perfil.foto_perfil = data.foto_perfil
    if data.multimedia: perfil.multimedia = ",".join(data.multimedia)

    db.commit()
    return {"msg": "Perfil actualizado correctamente"}

# Add this endpoint after the other endpoints
@app.post("/registro", response_model=LoginResponse)
def registro(req: RegistroRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(Usuario).filter(Usuario.email == req.usuario.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    # Check if passwords match
    if req.usuario.password != req.usuario.confirmar_password:
        raise HTTPException(status_code=400, detail="Las contraseñas no coinciden")

    try:
        # Create new user
        nuevo_usuario = Usuario(
            nombre=req.usuario.nombre,
            email=req.usuario.email,
            password=req.usuario.password  # In production, hash this password
        )
        db.add(nuevo_usuario)
        db.flush()  # Get ID without committing

        # Create profile
        nuevo_perfil = Perfil(
            usuario_id=nuevo_usuario.id,
            nombre_usuario=req.perfil.nombre_usuario
        )
        db.add(nuevo_perfil)
        db.commit()

        return {"user_id": nuevo_usuario.id}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# --------- CRUD de Anuncios ----------
@app.post("/anuncios/", response_model=AnuncioOut)
def crear_anuncio(anuncio: AnuncioCreate, usuario_id: int, db: Session = Depends(get_db)):
    nuevo = Anuncio(**anuncio.dict(), usuario_id=usuario_id)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@app.get("/anuncios/{usuario_id}", response_model=List[AnuncioOut])
def listar_anuncios(usuario_id: int, db: Session = Depends(get_db)):
    anuncios = db.query(Anuncio).filter_by(usuario_id=usuario_id).all()
    return anuncios

@app.put("/anuncios/{anuncio_id}", response_model=AnuncioOut)
def modificar_anuncio(anuncio_id: int, anuncio: AnuncioCreate, db: Session = Depends(get_db)):
    obj = db.query(Anuncio).filter_by(id=anuncio_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Anuncio no encontrado")
    for attr, value in anuncio.dict().items():
        setattr(obj, attr, value)
    db.commit()
    db.refresh(obj)
    return obj

@app.delete("/anuncios/{anuncio_id}")
def eliminar_anuncio(anuncio_id: int, db: Session = Depends(get_db)):
    obj = db.query(Anuncio).filter_by(id=anuncio_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Anuncio no encontrado")
    db.delete(obj)
    db.commit()
    return {"ok": True}

@app.get("/anuncios/{usuario_id}", response_model=List[AnuncioOut])
def listar_anuncios(usuario_id: int, db: Session = Depends(get_db)):
    anuncios = db.query(Anuncio).filter_by(usuario_id=usuario_id).all()
    return anuncios

@app.get("/anuncio/{anuncio_id}", response_model=AnuncioOut)
def get_anuncio(anuncio_id: int, db: Session = Depends(get_db)):
    anuncio = db.query(Anuncio).filter_by(id=anuncio_id).first()
    if not anuncio:
        raise HTTPException(status_code=404, detail="Anuncio no encontrado")
    return anuncio

# --------- User Info ----------
@app.get("/user/{user_id}")
def get_user_info(user_id: int, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(404, "Usuario no encontrado")
    
    perfil = db.query(Perfil).filter_by(usuario_id=user_id).first()
    return {
        "id": user.id,
        "name": user.nombre,
        "imagen": perfil.foto_perfil if perfil else None
    }

# --------- CRUD de Chat ----------
@app.get("/roster/{user_id}", response_model=List[UserInfo])
def get_roster(user_id: int, db: Session = Depends(get_db)):
    users = db.query(Usuario).filter(Usuario.id != user_id).all()
    roster = []
    for u in users:
        perfil = db.query(Perfil).filter_by(usuario_id=u.id).first()
        roster.append({
            "id": u.id,
            "name": u.nombre,
            "imagen": perfil.foto_perfil if perfil else None
        })
    return roster

@app.get("/conversations/{user_id}")
def get_conversations(user_id: int, db: Session = Depends(get_db), db_chats: Session = Depends(get_db_chats)):
    # Obtener todos los mensajes donde el usuario es emisor o receptor
    messages = db_chats.query(Message).filter(
        (Message.sender_id == user_id) | (Message.receiver_id == user_id)
    ).order_by(Message.timestamp.desc()).all()

    # Agrupar mensajes por conversación (con el otro usuario)
    conversations = {}
    for m in messages:
        other_user_id = m.receiver_id if m.sender_id == user_id else m.sender_id
        if other_user_id not in conversations:
            conversations[other_user_id] = {
                "id": other_user_id,
                "ultimoMensaje": m.body,
                "timestamp": m.timestamp
            }

    # Obtener datos de los otros usuarios
    response = []
    for other_id, conv_data in conversations.items():
        user = db.query(Usuario).filter_by(id=other_id).first()
        perfil = db.query(Perfil).filter_by(usuario_id=other_id).first()
        response.append({
            "id": other_id,
            "name": user.nombre if user else "",
            "imagen": perfil.foto_perfil if perfil else None,
            "ultimoMensaje": conv_data["ultimoMensaje"]
        })
    return response

@app.post("/chats/send", response_model=MessageOut)
def send_message(msg: MessageCreate, db: Session = Depends(get_db), db_chats: Session = Depends(get_db_chats)):
    # Verificar que ambos usuarios existen
    sender = db.query(Usuario).filter_by(id=msg.sender_id).first()
    receiver = db.query(Usuario).filter_by(id=msg.receiver_id).first()
    
    if not sender or not receiver:
        raise HTTPException(404, "Usuario no encontrado")

    message = Message(
        sender_id=msg.sender_id,
        receiver_id=msg.receiver_id,
        body=msg.body,
    )
    db_chats.add(message)
    db_chats.commit()
    db_chats.refresh(message)
    return message

@app.get("/chats/history/{user1_id}/{user2_id}", response_model=List[MessageOut])
def get_messages_history(
    user1_id: int,
    user2_id: int,
    db: Session = Depends(get_db_chats)
):
    messages = db.query(Message).filter(
        ((Message.sender_id == user1_id) & (Message.receiver_id == user2_id)) |
        ((Message.sender_id == user2_id) & (Message.receiver_id == user1_id))
    ).order_by(Message.timestamp).all()
    return messages
