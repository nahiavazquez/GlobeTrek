FROM node:16
WORKDIR /app
COPY ./package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
COPY .env.docker /app/.env
EXPOSE 3000
CMD ["npm", "start"]