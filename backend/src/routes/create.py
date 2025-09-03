from fastapi import APIRouter, UploadFile, Cookie, Depends, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import null
from datetime import datetime
from typing import Annotated

from ..database import models
from ..database.models import get_db
from ..utils.utils import write_image

router = APIRouter()

class CreatePostRequest(BaseModel):
    title: str
    body: str
    community: str
    image: UploadFile | None = None


@router.post("/create-post")
async def create_post(request: Annotated[CreatePostRequest, Form()], user_id: str = Cookie(None), db: Session = Depends(get_db)):
    
    if len(request.title) == 0 or len(request.title) > 75 or len(request.body) == 0 or len(request.body) > 750:
        return { "status" : "Error: Title or body has invalid length." }
    
    if request.image and request.image.content_type and not request.image.content_type.startswith("image/"):
        return { "status" : "Error: Must upload image file." }
    
    if not user_id:
        return { "status" : "Error: An issue occured. Try refreshing the page. "}
    
    community_id = db.query(models.Communities.id).filter(models.Communities.name == request.community.lower()).first()

    if not community_id:
        return { "status" : "Error: Requested community is not valid." }
    
    image_path = null()
    if request.image:
        image_path = write_image(request.image)
    
    entry = models.Posts(user_id=user_id, community=community_id[0], title=request.title, text=request.body, likes=0, date=datetime.today().strftime("%m/%d/%Y"), image=image_path)
    db.add(entry)
    db.commit()

    return { "status" : "success" }