# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Static file server
RUN npm install -g serve

# Copy artifact từ Jenkins
COPY build ./build

# Non-root user
RUN adduser -D crowdfunding \
  && chown -R crowdfunding:crowdfunding /app

USER crowdfunding

EXPOSE 8386

CMD ["serve", "-s", "build", "-l", "8386"]
