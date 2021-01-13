FROM debian:stable-slim

RUN apt update -y \
  && apt install bash curl unzip -y \
  && apt install make \
  && apt install -y --no-install-recommends nodejs \
  && apt install -y --no-install-recommends npm \
  && npm install -g npm@latest

RUN npm cache clean -f
RUN npm install -g n
RUN n stable

# Install PM2
RUN     yes | npm i pm2 -g
