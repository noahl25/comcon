@echo off
cd frontend
call npm install
call npm run build
npm run preview -- --port 5173