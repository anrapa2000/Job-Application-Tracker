#!/bin/bash

# Job Application Tracker Setup Script
echo "🚀 Setting up Job Application Tracker..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Backend Setup
echo "📦 Setting up backend..."
cd job-tracker-backend

# Create virtual environment
if [ ! -d "env" ]; then
    echo "Creating virtual environment..."
    python3 -m venv env
fi

# Activate virtual environment
echo "Activating virtual environment..."
source env/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create uploads directory
mkdir -p uploads

echo "✅ Backend setup complete!"

# Frontend Setup
echo "📦 Setting up frontend..."
cd ../job-tracker-frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"

# Create start script
echo "📝 Creating start script..."
cd ..
cat > start.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Job Application Tracker..."

# Start backend
echo "Starting backend server..."
cd job-tracker-backend
source env/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../job-tracker-frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "🌐 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
EOF

chmod +x start.sh

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  ./start.sh"
echo ""
echo "Or start manually:"
echo "  Backend: cd job-tracker-backend && source env/bin/activate && uvicorn main:app --reload"
echo "  Frontend: cd job-tracker-frontend && npm run dev"
echo ""
echo "📖 Read the README.md for more information!" 