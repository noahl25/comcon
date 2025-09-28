# Comcon 

A lightweight social media platform where people can discover what is happpening in the communities they love. Made in 2 weeks for the 2025 Vanderbilt Change++ application.

## Technologies Used

The frontend is primarily React, TailwindCSS, and framer-motion.  
The backend is Python with FastAPI and SQLAlchemy.

## How to Run

First, make sure you have NodeJS and Python 3.0+ installed.

**Please note that the middleware is only configured to accept requests from port 5173. So please run the frontend on port 5173.**

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

