FROM ubuntu:22.04

COPY playbook.yml /opt/playbook.yml

# ansible installation fix due to a requirement to type the location
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ='Europe/Vilnius' 

RUN apt update && apt-get install python3 ansible docker -y

RUN ansible-galaxy collection install community.docker
