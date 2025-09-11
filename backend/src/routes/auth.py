from fastapi import APIRouter, Response, Cookie
import uuid

router = APIRouter()

#create new identifier for user if one doesnt exist, or refresh the existing one. Http only so can only be accessed server side.
@router.post("/user-id")
async def user_id(response: Response, user_id: str = Cookie(None)):

    if not user_id:
        user: str = str(uuid.uuid4())
        response.set_cookie(key="user_id", value=user, httponly=True, secure=False, samesite="lax", max_age=60*60*24*30) #Cookie will last 30 days. Secure = false for local testing.
        return { "response": "new user id created" }
    
    else:
        response.set_cookie(key="user_id", value=user_id, httponly=True, secure=False, samesite="lax", max_age=60*60*24*30)
        return { "response": "cookie refreshed" } 

