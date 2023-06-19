@echo off

REM Start Node.js backend server
start "Node.js Server" cmd /c "cd .\backend\ && node .\src\index.js"

REM Start React frontend
start "React App" cmd /c "cd .\fronted\ && yarn dev"