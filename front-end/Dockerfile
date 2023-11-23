FROM ubuntu:latest
FROM node:20 as build-stage

WORKDIR /app

COPY . .

RUN sh -c 'npm i --omit=dev'

RUN sh -c 'npm run build'

FROM nginx:1.22.1-alpine as prod-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80 

RUN sh -c "nginx -t"

CMD ["nginx", "-g", "daemon off;"]
