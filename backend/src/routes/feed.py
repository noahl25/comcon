from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, case
import os
from pydantic import BaseModel

from ..database.models import get_db
from ..database import models
router = APIRouter()

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
        db.query(models.Posts, models.Communities)
            .join(models.Communities, models.Posts.community == models.Communities.id)
            .outerjoin(models.Likes, models.Likes.post_id == models.Posts.id)
            .filter(models.Posts.community.in_(community_ids))
            .filter(~models.Posts.id.in_(exclude_list))
            .group_by(models.Posts.id)
            .order_by(func.random())
            .limit(5)
            .add_column(func.count(models.Likes.id).label("like_count"))
            .add_column(func.max(case((models.Likes.user_id == user_id, 1), else_=0)).label("user_liked"))
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

#Image serving.
@router.get("/images")
async def get_image(image_name: str):

    file = os.path.join("images", image_name)

    if not os.path.exists(file):
        return { "status": "file not found" }
    
    return FileResponse(file)

class UpdateLikesRequest(BaseModel):
    liked: bool
    post_id: int

#Update like count.
@router.patch("/update-likes")
async def update_likes(request: UpdateLikesRequest, user_id: str = Cookie(None), db: Session = Depends(get_db)):
    
    if not db.query(models.Posts).get(request.post_id):
        return { "status" : "Error: Post does not exist." }
    
    current_like = db.query(models.Likes).filter(models.Likes.post_id == request.post_id, models.Likes.user_id == user_id).first()

    #Dont do anything if post already liked and another like request sent.
    if request.liked and current_like:
        return { "status" : "Error: Post already liked." }
    
    #Add row if liked.
    if request.liked:
        entry = models.Likes(post_id=request.post_id, user_id=user_id)
        db.add(entry)
        db.commit()
    #Remove row if unliked.
    else:
        db.delete(current_like)
        db.commit()

    return { "status": "success" }

#Get comments from post id.
@router.get("/get-comments")
async def get_comments(post_id: int, sorted: bool, user_id: str = Cookie(None), db: Session = Depends(get_db)):

    if sorted:

        #Create custom sorting so comments from user comes first.
        sort = case(
            ((models.Comments.user_id == user_id), 0),
            else_=1
        )

        query = (
            db.query(models.Comments)
                .filter(models.Comments.post_id == post_id)
                .add_column((models.Comments.user_id == user_id).label("user"))
                .order_by(sort)
                .all()
        )
    else:
        query = (
            db.query(models.Comments)
                .filter(models.Comments.post_id == post_id)
                .add_column((models.Comments.user_id == user_id).label("user"))
                .all()
        )

    return [
        {
            "text": comment.text,
            "id": comment.id,
            "isUsers": user
        }
        for comment, user in query
    ]

class CreateCommentRequest(BaseModel):
    text: str
    post_id: int

@router.post("/create-comment")
async def create_comment(request: CreateCommentRequest, user_id: str = Cookie(None), db: Session = Depends(get_db)):
    
    if len(request.text) > 250 or len(request.text) == 0:
        return { "status": "Error: Text has an invalid length." }
    
    if not db.query(models.Posts).get(request.post_id):
        return { "status": "Error: Post does not exist." }

    if not user_id:
        return { "status": "Error: An error occured. Try refreshing the page." }

    entry = models.Comments(post_id=request.post_id, text=request.text, user_id=user_id)
    db.add(entry)
    db.commit()

    db.refresh(entry) 
    return { "status": "success", "id" : entry.id } 