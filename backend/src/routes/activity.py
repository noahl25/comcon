from fastapi import APIRouter, Depends, Cookie
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import or_, func, case
from sqlalchemy.dialects import sqlite

from ..database.models import get_db
from ..database import models

router = APIRouter()

@router.get("/get-user-posts")
async def get_user_posts(user_id: str = Cookie(None), db: Session = Depends(get_db)):

    if not user_id:
        return []
    
    query = (
        db.query(models.Posts, models.Communities)
            .join(models.Communities, models.Posts.community == models.Communities.id)
            .outerjoin(models.Likes, models.Likes.post_id == models.Posts.id)
            .filter(models.Posts.user_id == user_id)
            .group_by(models.Posts.id)
            .add_column(func.count(models.Likes.id))
            .add_column(func.max(case((models.Likes.user_id == user_id, 1), else_=0)))
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
            "userLiked": bool(like)
        }
        for post, community, like_count, like in query
    ]

    return results

@router.get("/get-user-likes-comments")
async def get_user_likes_comments(user_id: str = Cookie(None), db: Session = Depends(get_db)):

    if not user_id:
        return []
    
    query = (
        db.query(models.Posts, models.Communities)
            .join(models.Communities, models.Posts.community == models.Communities.id)
            .outerjoin(models.Likes, models.Likes.post_id == models.Posts.id)
            .outerjoin(models.Comments, models.Comments.post_id == models.Posts.id)
            .filter(or_(models.Likes.user_id == user_id, models.Comments.user_id == user_id))
            .group_by(models.Posts.id)
            .add_column(func.count(models.Likes.id))
            .add_column(func.max(case((models.Likes.user_id == user_id, 1), else_=0)))
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
            "userLiked": bool(like)
        }
        for post, community, like_count, like in query
    ]

    print(results)

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
    query = db.query(models.Comments).filter(models.Comments.post_id == request.post_id).delete() #Then delete the comments.

    db.commit()

    return { "status": "success" }

class DeleteCommentRequest(BaseModel):
    comment_id: int

@router.delete("/delete-comment")
async def delete_comment(request: DeleteCommentRequest, user_id: str = Cookie(None), db: Session = Depends(get_db)):
    
    comment = db.query(models.Comments).filter(models.Comments.id == request.comment_id).first()


    if not comment:
        return { "status": "Error: comment does not exist." }

    if str(comment.user_id) != user_id:
        return { "status": "Error: cannot delete that comment."}
    
    db.delete(comment)
    db.commit()

    return { "status": "success" }