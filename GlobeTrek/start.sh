#!/bin/bash

python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8002 &

npm start --prefix /app/node/gateway
