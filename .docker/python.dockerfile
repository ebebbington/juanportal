FROM python:3

# update and get required packages
RUN apt update -y \
    && apt install -y --no-install-recommends nodejs npm \
    && node -v \
RUN npm install -g npm@latest \
    && yes | npm i -g pm2 \
    && pip install --upgrade pip \
    && pip install --upgrade pip \
    && pip install eventlet \
    && pip install -U python-dotenv \
    && pip install Flask \
    && pip install redis \
    && pip install flask-socketio