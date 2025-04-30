FROM node:23-slim

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]