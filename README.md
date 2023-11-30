## Virtualizacijos projektas

### Pasileidimas

Unix (with colima if Docker CLI is unavailable):

```bash
colima start && docker-compose up
```

No cache:

```bash
colima start && docker-compose up --force-recreate --build
```

docker compose -d

# stop all containers

docker ps -a --format="{{.ID}}" | \
 xargs docker update --restart=no | \
 xargs docker stop

# delete all containers

docker rm $(docker ps -q) -f

# connect to the container's CLI

docker-compose exec startup bash

cd /opt
cat playbook.yml
... edit a file locally without stopping container

cat playbook.yml
... new values are visible

# quit

exit

# change docker-compose.yml, reopen

docker-compose up -d

### Testavimas

- Happy path:
  - http://vhost1.localhost/
  - http://vhost2.localhost/
  - http://monitoring.localhost/
- Bad path:
  - http://vhost1.localhost/.htaccess

#### Passwords

vhost1:

    admin:adminpass

vhos2:

    admin:user1pass

vhostbackup:

    admin:user2pass

monitoring:

    admin:monitoring
