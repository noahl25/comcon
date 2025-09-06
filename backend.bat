@echo off
cd backend
call python -m venv venv
call venv\Scripts\activate
call pip install -r requirements.txt
python server.py