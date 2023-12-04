FROM debian:bookworm 

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm i
#ci --omit=dev

COPY . .

EXPOSE 5001

CMD ["npm", "start"]

