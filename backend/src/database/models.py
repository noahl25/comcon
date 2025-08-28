from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///database.db", echo=True)
Base = declarative_base()

class Posts(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False)
    communities = Column(String, nullable=False)
    text = Column(String(750), nullable=False)
    likes = Column(Integer, nullable=False)
    image = Column(String, nullable=True) #Path to locally stored image. Ideally images are stored on a cloud service provider but for a small application its fine.

class Comments(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    text = Column(String, nullable=False)


Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

 
 
