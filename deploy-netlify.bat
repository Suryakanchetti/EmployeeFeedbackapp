@echo off
echo 🚀 Employee Feedback App - Netlify Deployment
echo =============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the application
echo 🔨 Building the application...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check for errors.
    pause
    exit /b 1
)

echo ✅ Build completed successfully

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Netlify CLI...
    npm install -g netlify-cli
)

REM Deploy to Netlify
echo 🚀 Deploying to Netlify...
netlify deploy --prod --dir=build

echo ✅ Deployment completed!
echo.
echo 📋 Next steps:
echo 1. Set up your Supabase project at https://supabase.com
echo 2. Add environment variables in Netlify dashboard:
echo    - REACT_APP_SUPABASE_URL
echo    - REACT_APP_SUPABASE_ANON_KEY
echo 3. Import the database schema using database-setup-complete.sql
echo 4. Test your deployed application
echo.
echo 🌐 Your app should now be live on Netlify!
pause
