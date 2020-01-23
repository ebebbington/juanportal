FROM python:3

# update and get required packages
RUN apt update -y \
    && apt install -y --no-install-recommends nodejs npm
RUN npm install -g npm@latest
RUN pip install --upgrade pip
RUN yes | npm i pm2 -g
RUN pip install eventlet

# Install app dependencies
RUN pip install Flask
RUN pip install redis
RUN pip install flask-socketio