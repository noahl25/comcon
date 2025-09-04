from fastapi import APIRouter, Depends, Cookie
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from sqlalchemy.dialects import sqlite

from ..database.models import get_db
from ..database import models
from ..utils.utils import get_likes

router = APIRouter()

@router.get("/get-user-posts")
async def get_user_posts(user_id: str = Cookie(None), db: Session = Depends(get_db)):

    if not user_id:
        return []
    
    query = (
        db.query(models.Posts, models.Communities, models.Likes, func.count(models.Likes.id).label("like_count"))
            .join(models.Communities, models.Posts.community == models.Communities.id)
            .outerjoin(models.Likes, and_(models.Likes.post_id == models.Posts.id, models.Likes.user_id == user_id))
            .filter(models.Posts.user_id == user_id)
            .group_by(models.Posts.id)
            .limit(10)
            .all()
    )

    results = [
        {
            "communityName": community.name,
            "communityImage": community.image,
            "date": post.date,
            "title": post.title,
            "image": post.image,
            "text": post.text,
            "likes": like_count,
            "id": post.id,
            "userLiked": like is not None
        }
        for post, community, like, like_count in query
    ]

    return results

class DeletePostRequest(BaseModel):
    post_id: int

@router.delete("/delete-post")
async def delete_post(request: DeletePostRequest, user_id: str = Cookie(None), db: Session = Depends(get_db)):
    
    query = db.query(models.Posts).get(request.post_id)

    if not query:
        return { "status" : "Error: post does not exist." }

    if query.user_id != user_id:
        return { "status": "Error: cannot delete that post." }
    
    db.delete(query) #First delete the post.

    query = db.query(models.Likes).filter(models.Likes.post_id == request.post_id).delete() #Then delete all the likes from that post.

    db.commit()

    return { "status": "success" }