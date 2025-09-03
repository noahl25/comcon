from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, null
import os
import time

from ..database.models import get_db
from ..database import models

router = APIRouter()

def get_likes(post_ids: list, db: Session):
    results = (
        db.query(models.Likes.post_id, func.count())
            .filter(models.Likes.post_id.in_(post_ids))
            .group_by(models.Likes.post_id)
            .all()
    )

    return {post_id: likes for post_id, likes in results}

# Get 10 random posts from given communities. Exclude posts already seen in session.
@router.get("/get-posts")
async def get_posts(communities: str | None, exclude: str | None, user_id: str = Cookie(None), db: Session = Depends(get_db)):

    if not communities:
        return []
    
    all_communities = [c for c in communities.split(",") if c]

    exclude_list = []
    if exclude:
        exclude_list = [int(i) for i in exclude.split(",")]

    community_ids = [result[0] for result in db.query(models.Communities.id).filter(models.Communities.name.in_(all_communities)).all()] #List of all community id's.
    query = (
        db.query(models.Posts, models.Communities, models.Likes)
            .join(models.Communities, models.Posts.community == models.Communities.id)
            .outerjoin(models.Likes, and_(models.Likes.post_id == models.Posts.id, models.Likes.user_id == user_id))
            .filter(models.Posts.community.in_(community_ids))
            .filter(~models.Posts.id.in_(exclude_list))
            .order_by(func.random())
            .limit(10)
            .all()
    )
    likes = get_likes([post.id for post, community, likes in query], db)


    results = [
        {
            "communityName": community.name,
            "communityImage": community.image,
            "date": post.date,
            "title": post.title,
            "image": post.image,
            "text": post.text,
            "likes": likes.get(post.id, 0),
            "id": post.id,
            "userLiked": like is not None
        }
        for post, community, like in query
    ]

    return results

#Image serving.
@router.get("/images")
async def get_image(image_name: str):

    file = os.path.join("images", image_name)

    if not os.path.exists(file):
        return { "status": "file not found" }
    
    return FileResponse(file)

#Update like count.
@router.patch("/update-likes")
async def update_likes(liked: bool, post_id: int, user_id: str = Cookie(None), db: Session = Depends(get_db)):
    
    if not db.query(models.Posts).get(post_id):
        return { "status" : "Error: Post does not exist." }
    
    current_like = db.query(models.Likes).filter(models.Likes.post_id == post_id, models.Likes.user_id == user_id).first()

    print(current_like)

    #Dont do anything if post already liked and another like request sent.
    if liked and current_like:
        return { "status" : "Error: Post already liked." }
    
    #Add row if liked.
    if liked:
        entry = models.Likes(post_id=post_id, user_id=user_id)
        db.add(entry)
        db.commit()
    #Remove row if unliked.
    else:
        db.delete(current_like)
        db.commit()

    return { "status": "success" }

