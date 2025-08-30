from fastapi import APIRouter, UploadFile, Depends, Form, File
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy import null

from ..database.models import get_db
from ..database import models

from pydantic import BaseModel
from typing import Annotated

import os

router = APIRouter()

@router.get("/get-communities")
async def get_communities(q: str, db: Session = Depends(get_db)):

    if q == "random":
        results = db.query(models.Communities.name).order_by(func.random()).limit(7).all() #Get random community names. (For suggestions)
    else:
        results = db.query(models.Communities.name).filter(models.Communities.name.ilike(f"%{q}%")).limit(5).all() #Get top 5 matches for community name.

    print(results)
    return { "names" : [result[0] for result in results] }

class CreateCommunityRequest(BaseModel):
    name: str
    description: str
    image: UploadFile | None = None
    model_config = {"extra": "forbid"}

@router.post("/create-community")
async def create_community(request: Annotated[CreateCommunityRequest, Form()], db: Session = Depends(get_db)):

    if len(request.name) > 20 or len(request.description) > 750 or len(request.name) == 0:
        return { "status" : "Error: Name must be less than 20 characters and greater than 0 and description must be less than 750." }
    
    if db.query(models.Communities.name).filter(models.Communities.name == request.name.lower().strip()).scalar():
        return { "status" : f"Error: Community {request.name} already exists." }
    
    
    image_location = null()
    if request.image and request.image.filename:

        # Autoincrement filename if name exists already then write to folder.
        i = 0
        file = request.image.filename.split(".")[0]
        type = request.image.filename.split(".")[1]
        while os.path.exists(f"{file}{i}.{type}"):
            i += 1

        image_location = f"{file}{i}.{type}"

        os.makedirs("images", exist_ok=True)
        image_location = os.path.join("images", image_location)
        with open(image_location, "wb") as file:
            file.write(request.image.file.read())

    entry = models.Communities(name=request.name.lower().strip(), description=request.description.strip() if request.description.strip() != "" else null(), image=image_location)
    db.add(entry)
    db.commit()

    return { "status" : "success" }
    
                          