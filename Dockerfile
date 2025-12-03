FROM node:20 AS build-env
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:20-slim
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY --from=build-env /app/build ./build
COPY --from=build-env /app/app ./app
COPY vite.config.ts react-router.config.ts ./

EXPOSE 8386

CMD ["pnpm", "exec", "vite", "preview", "--host"]