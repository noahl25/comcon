from fastapi import APIRouter, UploadFile, Depends, Form, File
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy import null

from ..database.models import get_db
from ..database import models

from pydantic import BaseModel
from typing import Annotated

from ..utils.utils import write_image

router = APIRouter()

#Get random suggestions or matching search.
@router.get("/get-communities")
async def get_communities(q: str, exclude: str | None, db: Session = Depends(get_db)):

    exclude_list = []
    if exclude:
        exclude_list = [x.lower() for x in exclude.split(",")]

    if q == "random":
        results = db.query(models.Communities.name).filter(~models.Communities.name.in_(exclude_list)).order_by(func.random()).limit(7).all() #Get random community names. (For suggestions)
    else:
        results = db.query(models.Communities.name).filter(~models.Communities.name.in_(exclude_list)).filter(models.Communities.name.ilike(f"%{q}%")).limit(5).all() #Get top 5 matches for community name.

    return { "names" : [result[0] for result in results] }

class CreateCommunityRequest(BaseModel):
    name: str
    description: str
    image: UploadFile | None = None
    model_config = {"extra": "forbid"}

@router.post("/create-community")
async def create_community(request: Annotated[CreateCommunityRequest, Form()], db: Session = Depends(get_db)):

    if request.image and request.image.content_type and not request.image.content_type.startswith("image/"):
        return { "status" : "Error: Must upload image file." }
    
    if len(request.name) > 20 or len(request.description) > 750 or len(request.name) == 0:
        return { "status" : "Error: Name must be less than 20 characters and greater than 0 and description must be less than 750." }
    
    if db.query(models.Communities.name).filter(models.Communities.name == request.name.lower().strip()).scalar():
        return { "status" : f"Error: Community {request.name} already exists." }

    image_path = null()
    if request.image:
        image_path = write_image(request.image)

    entry = models.Communities(name=request.name.lower().strip(), description=request.description.strip() if request.description.strip() != "" else null(), image=image_path)
    db.add(entry)
    db.commit()

    return { "status" : "success" }
    
                          