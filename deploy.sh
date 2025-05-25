#!/bin/bash

# ADVisor Deployment Script
# This script helps you deploy the ADVisor application

set -e

echo "🚀 ADVisor Deployment Script"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Build completed successfully!"
echo ""
echo "📁 Build output is in the 'dist' folder"
echo ""
echo "🌐 Deployment Options:"
echo "1. GitHub Pages: Push to GitHub and enable Pages in repository settings"
echo "2. Netlify: Drag and drop the 'dist' folder to netlify.com"
echo "3. Vercel: Run 'npx vercel' in this directory"
echo "4. Static hosting: Upload the contents of 'dist' folder to your web server"
echo ""
echo "🎉 Deployment preparation complete!"

# Optional: Open the dist folder
if command -v explorer &> /dev/null; then
    echo "📂 Opening dist folder..."
    explorer dist
elif command -v open &> /dev/null; then
    echo "📂 Opening dist folder..."
    open dist
elif command -v xdg-open &> /dev/null; then
    echo "📂 Opening dist folder..."
    xdg-open dist
fi 