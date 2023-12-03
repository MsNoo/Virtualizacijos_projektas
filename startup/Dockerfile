FROM ubuntu

COPY playbook.yml /opt/playbook.yml

WORKDIR /

ARG DEBIAN_FRONTEND=noninteractive

# ansible installation fix due to a requirement to type the location
ENV TZ='Europe/Vilnius' 


# TODO: cia cmd turetu but?
RUN apt update && apt-get install python3 ansible docker-compose curl -y

RUN ansible-galaxy collection install community.docker

