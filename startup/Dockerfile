FROM debian:bookworm 

ARG DEBIAN_FRONTEND=noninteractive
# ansible installation fix
ENV TZ='Europe/Vilnius' 

RUN apt update && apt install python3 ansible docker-compose  -y

COPY playbook.yml /opt/playbook.yml

CMD apt-get install docker-compose -y