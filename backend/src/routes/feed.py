from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
import os

from ..database.models import get_db
from ..database import models

router = APIRouter()

# Get 10 random posts from given communities. Exclude posts already seen in session.
@router.get("/get-posts")
async def get_posts(communities: str | None, exclude: str | None, db: Session = Depends(get_db)):

    if not communities:
        return []
    
    all_communities = [c for c in communities.split(",") if c]

    exclude_list = []
    if exclude:
        exclude_list = [int(i) for i in exclude.split(",")]

    # Unoptimized solution. Query for the id's of each community by name in models.Communities. Then query by community id in models.Posts. 

    community_ids = [result[0] for result in db.query(models.Communities.id).filter(models.Communities.name.in_(all_communities)).all()]
    query = db.query(models.Posts).filter(models.Posts.community.in_(community_ids)).filter(~models.Posts.id.in_(exclude_list)).order_by(func.random()).limit(10).all()

    results = []
    for result in query:

        community: models.Communities | None = db.get(models.Communities, result.community)

        if community:
            results.append({
                "communityName": community.name,
                "communityImage": community.image,
                "date": result.date,
                "title": result.title,
                "image": result.image,
                "text": result.text,
                "likes": result.likes,
                "id": result.id
            })

    return results

@router.get("/images")
async def get_image(image_name: str):

    file = os.path.join("images", image_name)

    if not os.path.exists(file):
        return { "status": "file not found" }
    
    return FileResponse(file)