#!/bin/bash

# Dashboard System Verification Script
# This script verifies that all dashboard components are properly configured

echo "=========================================="
echo "🧪 Dashboard System Verification"
echo "=========================================="
echo ""

# Check if all content files exist
echo "📋 Checking Dashboard Content Pages..."
DASHBOARD_DIR="./Dashboard"

files=(
    "Content3.html"
    "Payroll.html"
    "Attendance.html"
    "Leave.html"
    "EmployeeDirectory.html"
    "Performance.html"
    "Training.html"
    "Analytics.html"
    "TaskList.html"
    "Tracking.html"
    "Settings.html"
)

missing_files=0
for file in "${files[@]}"; do
    if [ -f "$DASHBOARD_DIR/$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        missing_files=$((missing_files + 1))
    fi
done

echo ""
if [ $missing_files -eq 0 ]; then
    echo "✅ All content pages present!"
else
    echo "⚠️  $missing_files files missing"
fi

echo ""
echo "=========================================="
echo "📊 System Status"
echo "=========================================="
echo ""

# Check if Docker is running
if command -v docker &> /dev/null; then
    echo "✅ Docker installed"
    
    # Check if containers are running
    if docker ps | grep -q "dashingboard"; then
        echo "✅ Dashboard containers running"
        docker ps | grep dashingboard
    else
        echo "⚠️  Dashboard containers not running"
        echo "   Run: docker compose up -d"
    fi
else
    echo "❌ Docker not found"
fi

echo ""
echo "=========================================="
echo "🌐 Access Points"
echo "=========================================="
echo ""
echo "Frontend Services:"
echo "  • Signup:        http://13.62.228.92:8153/"
echo "  • Login:         http://13.62.228.92:8152/"
echo "  • Forgot Pass:   http://13.62.228.92:8151/"
echo "  • Dashboard:     http://13.62.228.92:8150/"
echo ""
echo "Backend:"
echo "  • API Server:    http://13.62.228.92:3048/"
echo "  • Database:      localhost:5432"
echo ""

echo "=========================================="
echo "✅ Verification Complete"
echo "=========================================="
echo ""
echo "To start the system, run:"
echo "  docker compose up -d"
echo ""
echo "To view logs:"
echo "  docker compose logs -f"
echo ""
