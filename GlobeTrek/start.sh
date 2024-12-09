#!/bin/bash

uvicorn backend.main:app --host 0.0.0.0 --port 8002 &

uvicorn gateway.main:app --host 0.0.0.0 --port 8889 &

npm start --prefix /app/node/nodeAPI
