FROM ubuntu:latest
# TODO: not latest, 18.04?
FROM node:20 as build-stage

WORKDIR /app

COPY ./src ./src
COPY ./public ./public
COPY ./package*.json .
COPY ./tsconfig.json .
# TODO: copy everything except node_modules



RUN npm ci
# --omit=dev'

# imanoma buildint pries keliant i containeri, taciau nebutu 1:1 consitency
RUN sh -c 'npm run build' 

FROM nginx:1.22.1-alpine as prod-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80 

RUN sh -c "nginx -t"

CMD ["nginx", "-g", "daemon off;"]
