#!/bin/bash
set -e

APP_DIR="/var/www/language-learner"
echo "🚀 Deploying Language Learner..."

cd $APP_DIR

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm run install:all

echo "🔨 Building React app..."
npm run build

echo "🔄 Restarting with PM2..."
pm2 restart ecosystem.config.js --env production 2>/dev/null \
  || pm2 start ecosystem.config.js --env production

pm2 save
echo "✅ Done — app running on port 3001"
