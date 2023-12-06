FROM mysql:8
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=database
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password


COPY ./initial-schema.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

CMD ["mysqld"]
