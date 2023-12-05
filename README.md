## Virtualizacijos projektas

### Pasileidimas

Unix (with colima if Docker CLI is unavailable):

```bash
docker-compose up
```

# Troubleshooting

Run `colima start` if docker daemon is causing issues on unix.

```bash
docker-compose up --force-recreate --build -d
```

docker compose -d

TODO: situs i notes perkelt is cia

# stop all containers

docker ps -a --format="{{.ID}}" | \
 xargs docker update --restart=no | \
 xargs docker stop && (docker rm $(docker ps -q) -f || echo 'Cannot stop.') &&
docker-compose up --force-recreate --build -d &&
docker-compose exec startup bash

# zsh alias: dce - docker-compose exec

# delete all containers

docker rm $(docker ps -q) -f

# cache troubleshooting 2

https://stackoverflow.com/a/32618288

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

    user1:user1pass

vhostbackup:

    admin:user2pass

monitoring:

    admin:monitoring
