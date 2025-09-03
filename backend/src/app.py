from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import explore, feed, auth, create, activity

app = FastAPI()

#Only authorize requests from frontend.
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

app.include_router(feed.router, prefix="/api/feed")
app.include_router(explore.router, prefix="/api/explore")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(activity.router, prefix="/api/activity")
app.include_router(create.router, prefix="/api/create")