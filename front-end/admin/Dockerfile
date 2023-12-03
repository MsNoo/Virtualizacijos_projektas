FROM ubuntu:18.04

RUN apt update

WORKDIR /app

COPY index.html index.html

RUN sh -c "apt-get install nginx -y"

COPY /index.html /usr/share/nginx/html

RUN sh -c "nginx -t"

EXPOSE 80 

CMD ["nginx", "-g", "daemon off;"]
