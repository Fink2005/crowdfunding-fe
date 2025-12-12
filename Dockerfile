FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# chỉ cần prod deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# copy build output
COPY build ./build

ENV NODE_ENV=production
ENV PORT=8386

EXPOSE 8386

CMD ["node", "build/server/index.js"]
