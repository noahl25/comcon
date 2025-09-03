from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
import os

from ..database.models import get_db
from ..database import models

router = APIRouter()

def get_likes(post_ids: list, db):
    results = (
        db.query(models.Likes.post_id, func.count())
            .filter(models.Likes.post_id.in_(post_ids))
            .group_by(models.Likes.post_id)
            .all()
    )

    return {post_id: likes for post_id, likes in results}

# Get 10 random posts from given communities. Exclude posts already seen in session.
@router.get("/get-posts")
async def get_posts(communities: str | None, exclude: str | None, db: Session = Depends(get_db)):

    if not communities:
        return []
    
    all_communities = [c for c in communities.split(",") if c]

    exclude_list = []
    if exclude:
        exclude_list = [int(i) for i in exclude.split(",")]

    community_ids = [result[0] for result in db.query(models.Communities.id).filter(models.Communities.name.in_(all_communities)).all()]
    query = (
        db.query(models.Posts, models.Communities)
            .join(models.Communities, models.Posts.community == models.Communities.id)
            .filter(models.Posts.community.in_(community_ids))
            .filter(~models.Posts.id.in_(exclude_list))
            .order_by(func.random())
            .limit(10)
            .all()
    )
    likes = get_likes([post.id for post, community in query], db)


    results = [
        {
            "communityName": community.name,
            "communityImage": community.image,
            "date": post.date,
            "title": post.title,
            "image": post.image,
            "text": post.text,
            "likes": likes.get(post.id, 0),
            "id": post.id
        }
        for post, community in query
    ]

    return results

@router.get("/images")
async def get_image(image_name: str):

    file = os.path.join("images", image_name)

    if not os.path.exists(file):
        return { "status": "file not found" }
    
    return FileResponse(file)

@router.patch("/update-likes")
async def update_likes(liked: bool, db: Session = Depends(get_db)):
    
    print(liked)
