FROM node:20-alpine

WORKDIR /app

# cài server tĩnh nhẹ
RUN npm install -g serve

# copy build output
COPY build ./build

EXPOSE 8386

CMD ["serve", "-s", "build", "-l", "8386"]
