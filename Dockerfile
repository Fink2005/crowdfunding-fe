FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# cần dev deps vì vite preview cần vite
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# copy build output
COPY build ./build
COPY vite.config.ts ./

ENV NODE_ENV=production
ENV PORT=8386

EXPOSE 8386

CMD ["pnpm", "exec", "vite", "preview", "--host", "--port", "8386"]
