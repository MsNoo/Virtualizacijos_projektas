FROM debian:bookworm 

COPY playbook.yml /opt/playbook.yml

ARG DEBIAN_FRONTEND=noninteractive

# ansible installation fix due to a requirement to type the location
ENV TZ='Europe/Vilnius' 


RUN apt update && apt install python3 ansible docker-compose curl -y

RUN ansible-galaxy collection install community.docker


CMD apt-get install docker-compose -y