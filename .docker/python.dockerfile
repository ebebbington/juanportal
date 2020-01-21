FROM alpine:3.8

# update and get required packages
RUN apk update upgrade \
    && apk add python py-pip \
    && apk add curl bash \
    && apk add npm

# update pip
RUN pip install --upgrade pip

# install npm
RUN yes | npm i pm2 -g

# Install app dependencies
RUN pip install Flask
RUN pip install redis
RUN pip install flask-socketio