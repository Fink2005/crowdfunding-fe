FROM node:20-alpine

WORKDIR /app
RUN npm install -g pnpm
RUN adduser -D crowdfunding

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY build ./build

RUN chown -R crowdfunding:crowdfunding /app
USER crowdfunding

EXPOSE 8386
CMD ["pnpm", "exec", "vite", "preview", "--host"]
