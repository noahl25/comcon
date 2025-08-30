from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session, load_only
from sqlalchemy.sql import func

from ..database.models import get_db
from ..database import models

from pydantic import BaseModel

router = APIRouter()

@router.get("/get-communities")
async def get_communities(q: str, request: Request, db: Session = Depends(get_db)):

    if q == "random":
        results = db.query(models.Communities.name).order_by(func.random()).limit(7).all() #Get random community names. (For suggestions)
    else:
        results = db.query(models.Communities.name).filter(models.Communities.name.ilike(f"%{q}%")).limit(5).all() #Get top 5 matches for community name.

    print(results)
    return { "names" : [result[0] for result in results] }
    
                          