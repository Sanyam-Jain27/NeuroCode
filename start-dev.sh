#!/bin/bash
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

echo "=========================================================="
echo " 🚀 Booting NeuroCode Cloud IDE & Microservices Ecosystem"
echo "=========================================================="

echo "🧹 Clearing ports 8000-8006 and 5173..."
PIDS=$(lsof -ti tcp:8000-8006 -ti tcp:5173 2>/dev/null)
if [ -n "$PIDS" ]; then
    echo "$PIDS" | xargs kill -9 2>/dev/null || true
    sleep 1
fi

if nc -z 127.0.0.1 6379 2>/dev/null || lsof -i :6379 >/dev/null 2>&1; then
    echo "✅ Redis is running on port 6379."
else
    echo "⚠️  Redis is not running on 6379."
fi

# Ensure node-pty spawn-helper has execution permissions on macOS
find "$PROJECT_ROOT/backend/services/terminal/node_modules/node-pty" -name "spawn-helper" -exec chmod +x {} + 2>/dev/null || true

cleanup() {
    echo ""
    echo "🛑 Shutting down all NeuroCode services..."
    lsof -ti tcp:8000-8006 -ti tcp:5173 2>/dev/null | xargs kill -9 2>/dev/null || true
    echo "✨ All services stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "🌟 Starting microservices..."

(cd "$PROJECT_ROOT/backend/services/auth" && npm start) &
(cd "$PROJECT_ROOT/backend/services/project" && npm start) &
(cd "$PROJECT_ROOT/backend/services/file" && npm start) &
(cd "$PROJECT_ROOT/backend/services/ai" && npm start) &
(cd "$PROJECT_ROOT/backend/services/terminal" && npm start) &
(cd "$PROJECT_ROOT/backend/services/payment" && npm start) &

sleep 2

(cd "$PROJECT_ROOT/backend/gateway" && npm start) &
(cd "$PROJECT_ROOT/frontend" && npm run dev) &

echo ""
echo "=========================================================="
echo " 🎉 All NeuroCode services started!"
echo " 🌐 Frontend:    http://localhost:5173"
echo " 🚪 API Gateway: http://localhost:8000"
echo " ⌨️  Press Ctrl+C to stop all services"
echo "=========================================================="
echo ""

wait
