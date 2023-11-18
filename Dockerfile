FROM node:21-alpine3.17

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "run", "serve"]
