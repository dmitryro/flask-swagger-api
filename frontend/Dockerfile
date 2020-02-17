FROM node:alpine

WORKDIR /dist

COPY package*.json ./

COPY . /dist

RUN \
  apk update                     && \
  apk add bash                   && \
  npm install -G yarn typescript && \
  yarn 

EXPOSE 8080
