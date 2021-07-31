FROM nginx:alpine

# Copy nginx config file
COPY    ./.docker/config/juanportal.conf /etc/nginx/conf.d/juanportal.conf

ENTRYPOINT ["nginx"]
CMD ["-g","daemon off;"]
