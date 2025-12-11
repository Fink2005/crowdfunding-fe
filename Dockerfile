FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:20-alpine
RUN npm install -g pnpm
RUN adduser -D crowdfunding
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY --from=builder /app/build ./build
COPY --from=builder /app/app ./app
COPY vite.config.ts react-router.config.ts ./
USER crowdfunding


EXPOSE 8386

CMD ["pnpm", "exec", "vite", "preview", "--host"]