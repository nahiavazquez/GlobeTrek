FROM node:16-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
