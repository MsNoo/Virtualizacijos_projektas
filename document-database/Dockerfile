FROM postgres:latest

ENV POSTGRES_DB=document-project
ENV POSTGRES_PASSWORD=university

COPY initial-schema.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
