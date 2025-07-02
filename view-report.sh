#!/bin/bash

echo "🚀 Starting Allure Report Server..."
echo "📊 Report will be available at: http://localhost:8080"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

cd allure-report && python3 -m http.server 8080