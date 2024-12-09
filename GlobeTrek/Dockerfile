# Multi-stage build for backend, gateway, and nodeAPI

# Stage 1: Python base for backend and gateway
FROM python:3.9-slim AS python-base
WORKDIR /app/backend

# Set environment variables for Python
ENV PYTHONPATH=/app/backend:$PYTHONPATH \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies in one step to reduce image layers
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application files
COPY backend ./backend

# Stage 2: Node.js base for gateway and nodeAPI
FROM node:16-slim AS node-base
WORKDIR /app/node

# Install system dependencies for Node.js
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js dependencies for both gateway and nodeAPI
COPY gateway/package*.json ./gateway/
COPY nodeAPI/package*.json ./nodeAPI/
RUN npm install --legacy-peer-deps --prefix gateway
RUN npm install --legacy-peer-deps --prefix nodeAPI

# Copy application files
COPY gateway ./gateway
COPY nodeAPI ./nodeAPI

# Stage 3: Final production image
FROM node:16-slim
WORKDIR /app

# Copy over backend and Node.js services
COPY --from=python-base /app/backend /app/backend
COPY --from=node-base /app/node /app/node

# Expose necessary ports
EXPOSE 8002 8889 3000

# Start all services
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port 8002 & uvicorn gateway.main:app --host 0.0.0.0 --port 8889 & npm start --prefix /app/node/nodeAPI"]
