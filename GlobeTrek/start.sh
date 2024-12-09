#!/bin/bash

export PYTHONPATH=/app/backend:$PYTHONPATH

if [ -x "$(command -v python3)" ]; then
    python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8002 &
else
    echo "Error: python3 not found"
    exit 1
fi

if [ -f /app/node/gateway/package.json ]; then
    PORT=${PORT:-3000}
    npm start --prefix /app/node/gateway -- --port=$PORT
else
    echo "Error: Gateway package.json not found"
    exit 1
fi
