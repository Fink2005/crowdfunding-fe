FROM node:20-alpine

WORKDIR /app

COPY node_modules ./node_modules
COPY build ./build
COPY package.json vite.config.ts ./

EXPOSE 8386

CMD ["./node_modules/.bin/vite", "preview", "--host", "--port", "8386"]
