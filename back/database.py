from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./usuarios.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- DB de chats ---
SQLALCHEMY_DATABASE_URL_CHATS = "sqlite:///./chats.db"
engine_chats = create_engine(SQLALCHEMY_DATABASE_URL_CHATS, connect_args={"check_same_thread": False})
SessionChats = sessionmaker(autocommit=False, autoflush=False, bind=engine_chats)
BaseChats = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_chats():
    db = SessionChats()
    try:
        yield db
    finally:
        db.close()