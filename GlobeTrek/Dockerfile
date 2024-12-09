FROM python:3.9-slim AS gateway
WORKDIR /gateway
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*
COPY gateway/requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt
COPY gateway .  

FROM python:3.9-slim AS backend
WORKDIR /backend
ENV PYTHONPATH=/backend:$PYTHONPATH
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt
COPY backend .  

FROM node:16-slim AS globetrek
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY globetrek/package*.json .
RUN npm install --no-cache --legacy-peer-deps
COPY globetrek .

FROM python:3.9-slim
WORKDIR /app
COPY --from=gateway /gateway /app/gateway  
COPY --from=backend /backend /app/backend  
COPY --from=globetrek /app /app/globetrek  

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port 8002 & npm start --prefix /app/globetrek"]
