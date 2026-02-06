#!/bin/bash

echo "🚀 AI Roadtrip Genie - Frontend Launcher"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🎨 Starting Next.js development server..."
echo "🌐 Visit: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
