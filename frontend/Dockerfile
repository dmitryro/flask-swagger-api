FROM node:alpine

WORKDIR /dist

COPY package*.json ./

COPY . /dist

RUN \
  apk update                     && \
  apk add bash                   && \
  npm install -G yarn typescript && \
  npx -p @ant-design/codemod-v4 antd4-codemod ./src --force && \
  yarn global add @ant-design/codemod-v4 && \
  antd4-codemod ./src --force && \ 
  yarn 

EXPOSE 8080
