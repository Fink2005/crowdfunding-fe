FROM node:20-alpine

WORKDIR /app
RUN npm install -g pnpm

# chỉ prod deps (vite phải nằm trong dependencies)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# copy kết quả đã build từ Jenkins
COPY build ./build
COPY vite.config.ts ./

EXPOSE 8386
CMD ["pnpm", "exec", "vite", "preview", "--host", "--port", "8386"]
