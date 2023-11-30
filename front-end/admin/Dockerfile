FROM ubuntu:latest
# TODO: not latest, 18.04?
FROM node:20 as build-stage

RUN apt update

WORKDIR /app

COPY index.html index.html

FROM nginx:1.22.1-alpine as prod-stage

COPY --from=build-stage /app/index.html  /usr/share/nginx/html

EXPOSE 80 

RUN sh -c "nginx -t"

CMD ["nginx", "-g", "daemon off;"]
