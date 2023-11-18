FROM node:21-alpine3.17

ENV DOCKERIZE_VERSION v0.7.0

WORKDIR /app

RUN apk update --no-cache \
    && apk add --no-cache wget openssl \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apk del wget

COPY . .

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "run", "serve"]
