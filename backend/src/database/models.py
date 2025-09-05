from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///database.db", echo=True)
Base = declarative_base()

#Database to store all information related to a post.
class Posts(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False)
    community = Column(Integer, nullable=False) #Reference to community in Communities table.
    title = Column(String(75), nullable=False)
    text = Column(String(750), nullable=False)
    date = Column(String, nullable=False)
    image = Column(String, nullable=True) #Path to locally stored image. Ideally images are stored on a cloud service provider but for a small application its fine.

class Likes(Base):

    __tablename__ = "likes"

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, nullable=False)
    user_id = Column(String, nullable=False)


#Store comments with reference to original post.
class Comments(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, nullable=False)
    user_id = Column(String, nullable=False)
    text = Column(String, nullable=False)

#All existing communities and their descriptions.
class Communities(Base):
    __tablename__ = "communities"

    id = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False, unique=True)
    description = Column(String(750))
    image = Column(String, nullable=True)

Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

 
 
