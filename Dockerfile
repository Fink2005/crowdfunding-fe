FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY build ./build
COPY server.mjs ./server.mjs

ENV NODE_ENV=production
ENV PORT=8386

EXPOSE 8386

CMD ["node", "server.mjs"]
