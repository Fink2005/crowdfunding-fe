FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm run build



FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Create user
RUN adduser -D crowdfunding

WORKDIR /app

# Copy files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY --from=builder /app/build ./build
COPY --from=builder /app/app ./app
COPY vite.config.ts react-router.config.ts ./

# *** FIX QUAN TRỌNG: CHOWN quyền /app ***
RUN chown -R crowdfunding:crowdfunding /app

# Switch user AFTER permissions OK
USER crowdfunding

EXPOSE 8386
CMD ["pnpm", "exec", "vite", "preview", "--host"]
