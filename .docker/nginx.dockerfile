FROM nginx:latest

# Update and install required packages
RUN     apt-get update

# Copy nginx config file
COPY    ./.docker/config/juanportal.conf /etc/nginx/conf.d/juanportal.conf

ENTRYPOINT ["nginx"]
CMD ["-g","daemon off;"]
