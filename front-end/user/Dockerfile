FROM node:20 as build-stage

RUN apt update

WORKDIR /app

ENV REACT_APP_DOCUMENT_MICROSERVICE_URL=http://localhost:5001

COPY ./src ./src
COPY ./public ./public
COPY ./package*.json .
COPY ./tsconfig.json .

RUN npm ci

RUN sh -c 'npm run build' 

FROM nginx:1.22.1-alpine as prod-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80 

RUN sh -c "nginx -t"

CMD ["nginx", "-g", "daemon off;"]
