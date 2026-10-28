@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js LTS, then try again.
  pause
  exit /b 1
)
start "" "http://localhost:5188/"
node "scripts\serve.mjs"
if errorlevel 1 pause
