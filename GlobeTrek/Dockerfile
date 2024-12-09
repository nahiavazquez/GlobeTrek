FROM node:16-slim AS base
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-dev libpq-dev gcc curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend
COPY backend/requirements.txt ./requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt
COPY backend ./backend

WORKDIR /app/node
COPY gateway/package*.json /app/node/gateway/
COPY nodeAPI/package*.json /app/node/nodeAPI/
RUN npm install --legacy-peer-deps --prefix /app/node/nodeAPI
COPY gateway /app/node/gateway
COPY nodeAPI /app/node/nodeAPI

WORKDIR /app

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 8889

CMD ["/app/start.sh"]
