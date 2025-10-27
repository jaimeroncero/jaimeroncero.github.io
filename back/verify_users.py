from database import SessionLocal
from models import Usuario

def check_users():
    db = SessionLocal()
    try:
        users = db.query(Usuario).all()
        print("\nUsuarios en la base de datos:")
        print("-----------------------------")
        for user in users:
            print(f"ID: {user.id}, Nombre: {user.nombre}, Email: {user.email}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()