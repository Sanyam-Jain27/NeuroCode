#!/bin/bash
echo "🧹 Terminating all NeuroCode services on ports 8000-8006, 5173..."
PIDS=$(lsof -ti tcp:8000-8006 -ti tcp:5173 2>/dev/null)
if [ -n "$PIDS" ]; then
    echo "$PIDS" | xargs kill -9 2>/dev/null
    echo "✅ Ports 8000-8006 and 5173 cleared!"
else
    echo "✅ No services running on these ports."
fi
