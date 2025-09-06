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

I included two batch files, [setup.bat](https://github.com/noahl25/comcon/blob/main/setup.bat) and [run.bat](https://github.com/noahl25/comcon/blob/main/run.bat), which should install the correct packages and run both the frontend and backend.  

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

For the frontend, run the following commands:
```
cd frontend
npm install
npm run build
npm run preview
```

## Reflection

