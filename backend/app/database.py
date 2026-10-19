"""
EduPredict AI - Database Connection & Session Management
Supports both MySQL and SQLite seamlessly with SQLAlchemy ORM and raw SQL query execution.
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Engine configuration depending on DB dialect
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        echo=False
    )
else:
    # MySQL connection pooling
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600,
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI Dependency for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def execute_raw_sql(query_str: str, params: dict = None):
    """
    Executes a raw SQL analytical query and returns records as dictionaries.
    Demonstrates true SQL capability for academic evaluation.
    """
    with engine.connect() as conn:
        result = conn.execute(text(query_str), params or {})
        if result.returns_rows:
            keys = result.keys()
            return [dict(zip(keys, row)) for row in result.fetchall()]
        return []
