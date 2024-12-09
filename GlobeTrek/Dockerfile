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

COPY gateway/package*.json /app/node/gateway/
COPY nodeAPI/package*.json /app/node/nodeAPI/
RUN npm install --legacy-peer-deps --prefix /app/node/nodeAPI

COPY gateway /app/node/gateway
COPY nodeAPI /app/node/nodeAPI

FROM node:16-slim
WORKDIR /app

COPY --from=python-base /app/backend /app/backend

COPY --from=node-base /app/node /app/node

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 8889

CMD ["/app/start.sh"]
