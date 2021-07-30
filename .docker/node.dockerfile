FROM debian:stable-slim

RUN apt-get update && apt-get install bash curl unzip -y \
  && apt-get install -y --no-install-recommends npm \
  && apt-get install -y nodejs \
  && npm install -g npm@latest \
  && npm i pm2 -g

# Copy over rest of files across
ARG PROJECT_NAME
WORKDIR /var/www/$PROJECT_NAME
COPY src/$PROJECT_NAME/tsconfig.json ./

COPY src/$PROJECT_NAME/. .