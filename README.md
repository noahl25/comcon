# Comcon 

A lightweight social media platform where people can discover what is happpening in the communities they love. Made in 2 weeks for the 2025 Vanderbilt Change++ application.

## Contact

Name: Noah Lisin  
Email: noah.g.lisin@vanderbilt.edu

## Technologies Used

The frontend is primarily React, TailwindCSS, and framer-motion.  
The backend is Python with FastAPI and SQLAlchemy.

## How to Run

**Note: The following setup instructions are for Windows machines only. Unfortunately I don't have a chance to test on Mac, but the setup should be similar just with different syntax.**  

First, make sure you have NodeJS and Python 3.0+ installed.  

I included two batch files, [backend.bat](https://github.com/noahl25/comcon/blob/main/backend.bat) and [frontend.bat](https://github.com/noahl25/comcon/blob/main/frontend.bat), which should install the correct packages and run both the frontend and backend. Just open two terminals in the root directory and run both.

If you want to setup and run the program yourself, you can do the following steps.  

First, to setup and run the backend, run the following commands:
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python server.py
```
Using a virtual environment isn't required but I reccomended it to prevent any issues.  

For the frontend, in another terminal, run the following commands:
```
cd frontend
npm install
npm run build
npm run preview -- --port 5173
```

## Important Notes

- **Your user ID is connected to your browser session. If you want to test multiple users, opening the project in another browser or a different profile will allow you to do so.**
- I included a database that already has some content in it, so you should be able to see communities and posts immediately.
- Images are served locally, so if you want to use the database I included, make sure that you have all the images in the backend/images folder.

Basic rundown of how the site works:
- It's like Reddit/Fizz.
- You can navigate to the "Explore" page to join a community. There are some community suggestions but you can search for one too. I only included like 10 so I wouldn't search anything too niche.
- You can create your own community by clicking the plus. Creating a community will automatically join it.
- You can see your joined communities in the "Feed" page. You can see posts from your communities there as well.
- Liking and commenting on posts is pretty straightforward. You can right click one of your comments to delete or edit it.
- You can create posts in the "Create" page.
- You can then see your posts in the "Activity" page.
- In the "Activity" page you can click on either "your posts" to see your posts or "likes/comments" to see posts you've liked or commented on.
- Right click one of your posts to delete it.

## Reflection

Throughout this challenge, quite a few issues arose. I challenged myself to fill the site with unique animations and smooth flow, but with that came many problems. I spent a lot time smoothing out the issues and am glad I did, because I'm happy with the final product. I learned a lot about SQL and SQLAlchemy throughout this process. I tried to optimize my queries so I learned a lot about the quirks of SQL and SQLAlchemy, and ways you can simplify problems.
