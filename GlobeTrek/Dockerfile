FROM python:3.9-slim AS python-base
WORKDIR /app/backend
ENV PYTHONPATH=/app/backend:$PYTHONPATH

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./backend/
RUN pip install -r backend/requirements.txt

COPY backend ./backend

FROM node:16 AS node-base
WORKDIR /app/node

COPY gateway/package*.json ./gateway/
COPY nodeAPI/package*.json ./nodeAPI/

RUN npm install --legacy-peer-deps --prefix gateway
RUN npm install --legacy-peer-deps --prefix nodeAPI

COPY gateway ./gateway
COPY nodeAPI ./nodeAPI

FROM node:16-slim
WORKDIR /app
COPY --from=python-base /app/backend /app/backend
COPY --from=node-base /app/node /app/node

EXPOSE 8002 8889 3000

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port 8002 & uvicorn gateway.main:app --host 0.0.0.0 --port 8889 & npm start --prefix /app/node/nodeAPI"]
