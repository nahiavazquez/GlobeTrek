FROM python:3.9-slim AS python-base
WORKDIR /app/backend

ENV PYTHONPATH=/app/backend:$PYTHONPATH \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend ./backend

FROM node:16-slim AS node-base
WORKDIR /app/node

RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

COPY gateway/package*.json ./gateway/
COPY nodeAPI/package*.json ./nodeAPI/
RUN npm install gateway
RUN npm install --legacy-peer-deps --prefix nodeAPI

COPY gateway ./gateway
COPY nodeAPI ./nodeAPI

FROM node:16-slim
WORKDIR /app

COPY --from=python-base /app/backend /app/backend

COPY --from=node-base /app/node /app/node

EXPOSE 8889

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port 8002 & npm start --prefix /app/node/gateway"]
