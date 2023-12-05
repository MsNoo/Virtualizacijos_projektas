FROM ubuntu:18.04
FROM node:20 as build-stage

RUN apt update

WORKDIR /app

COPY ./src ./src
COPY ./public ./public
COPY ./package*.json .
COPY ./tsconfig.json .

RUN npm ci

# imanoma buildint pries keliant i containeri, taciau nebutu 1:1 consistency
RUN sh -c 'npm run build' 

FROM nginx:1.22.1-alpine as prod-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80 

RUN sh -c "nginx -t"

CMD ["nginx", "-g", "daemon off;"]
