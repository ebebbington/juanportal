# FROM python:3.7-alpine

# RUN pip install --upgrade pip

# RUN pip install flask-socketio

# WORKDIR /var/www/socket
# ENV FLASK_APP app.py
# #ENV FLASK_RUN HOST 127.0.0.1
# RUN apk add --no-cache gcc musl-dev linux-headers
# COPY ./src/socket/requirements.txt requirements.txt
# RUN pip install -r requirements.txt
# COPY ./src/socket /var/www/socket
# CMD ["flask", "run"]
FROM alpine:3.1

# Update
RUN apk add --update python py-pip

# Install app dependencies
RUN pip install Flask

# # Bundle app source
# COPY simpleapp.py simpleapp.py

CMD ["python", "/var/www/socket/app.py", "-p 9009"]