FROM node:20-alpine

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# copy build output
COPY build ./build

EXPOSE 8386

CMD ["pnpm", "exec", "vite", "preview", "--host", "--port", "8386"]
