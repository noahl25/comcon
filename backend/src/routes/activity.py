from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from ..database.models import get_db

router = APIRouter()

@router.get("/get-user-posts")
async def get_user_posts(user_id: str = Cookie(None), db: Session = Depends(get_db)):
    pass