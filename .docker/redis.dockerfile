FROM redis:5

# Update and install required packages
RUN     apt-get update
RUN     apt-get install vim -y