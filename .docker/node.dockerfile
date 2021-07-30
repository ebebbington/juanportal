FROM debian:stable-slim

RUN apt-get --fix-missing update -y \
  && apt-get install -f \
  && apt-get upgrade -y \
  && apt-get install bash curl unzip -y \
  && apt-get install -y --no-install-recommends npm \
  && npm install -g npm@latest
RUN npm cache clean -f \
  && npm i pm2 -g

# Copy over rest of files across
ARG PROJECT_NAME
WORKDIR /var/www/$PROJECT_NAME
COPY src/$PROJECT_NAME/package.json src/$PROJECT_NAME/package-lock.json src/$PROJECT_NAME/tsconfig.json ./
RUN npm ci --prefer-offline --no-audit --progress=false
COPY src/$PROJECT_NAME/. .
RUN npm run build
COPY src/$PROJECT_NAME/. .