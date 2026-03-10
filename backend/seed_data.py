import uuid

from passlib.context import CryptContext

from database import Base, SessionLocal, engine
from models import Employee, Office

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    offices = [
        {
            "name": "Head Office",
            "address": "Connaught Place, New Delhi 110001",
            "city": "New Delhi",
            "latitude": 28.6315,
            "longitude": 77.2167,
            "phone": "+91-11-23456789",
            "email": "headoffice@smartcommute.in",
            "capacity": 500,
        },
        {
            "name": "Tech Hub",
            "address": "Cyber City, Gurugram 122002",
            "city": "Gurugram",
            "latitude": 28.4950,
            "longitude": 77.0890,
            "phone": "+91-124-4567890",
            "email": "techhub@smartcommute.in",
            "capacity": 800,
        },
        {
            "name": "Operations Center",
            "address": "Sector 62, Noida 201309",
            "city": "Noida",
            "latitude": 28.6272,
            "longitude": 77.3717,
            "phone": "+91-120-3456789",
            "email": "operations@smartcommute.in",
            "capacity": 400,
        },
        {
            "name": "South Branch",
            "address": "BKC, Mumbai 400051",
            "city": "Mumbai",
            "latitude": 19.0596,
            "longitude": 72.8656,
            "phone": "+91-22-23456789",
            "email": "southbranch@smartcommute.in",
            "capacity": 600,
        },
        {
            "name": "East Office",
            "address": "Salt Lake, Kolkata 700091",
            "city": "Kolkata",
            "latitude": 22.5764,
            "longitude": 88.4342,
            "phone": "+91-33-23456789",
            "email": "eastoffice@smartcommute.in",
            "capacity": 350,
        },
    ]

    for o in offices:
        exists = db.query(Office).filter(Office.name == o["name"]).first()
        if not exists:
            db.add(Office(id=uuid.uuid4(), **o))
            print(f"✅ Added office: {o['name']}")

    admin = (
        db.query(Employee)
        .filter(Employee.email == "admin@smartcommute.in")
        .first()
    )

    if not admin:
        db.add(
            Employee(
                id=uuid.uuid4(),
                name="Admin User",
                employee_id="EMP000",
                email="admin@smartcommute.in",
                phone="9999999999",
                department="Engineering",
                role="ADMIN",
                hashed_password=pwd_context.hash("Admin@123"),
                is_active=True,
            )
        )
        print("✅ Admin user created!")

    db.commit()
    db.close()

    print("")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("🚀 SmartCommute Ready!")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("🌐 Frontend: http://localhost:5173")
    print("🔧 Backend:  running")
    print("📖 API Docs: /docs")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("👤 admin@smartcommute.in")
    print("🔑 Admin@123")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


if __name__ == "__main__":
    seed()

