#!/bin/bash

export PYTHONPATH=/app/backend:$PYTHONPATH

python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8002 &

PORT=${PORT:-3000}
npm start --prefix /app/node/gateway -- --port=$PORT
