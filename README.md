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

  To view backups access or call: http://vhostbackup.localhost/
  To create a backup access: http://vhostbackup.localhost/backup
  To restore a backup access: http://vhostbackup.localhost/restore
  Example: http://vhostbackup.localhost/restore?ID=20231126143610896993&timestamp=2023-11-26%2014:36:10&list=vhost1,vhost2,api
  To view current backup config: http://vhostbackup.localhost/getConfig
  To set default backup config: http://vhostbackup.localhost/setDefaultConfig
  To change (override) current backup config: http://vhostbackup.localhost/setConfig
  Example: http://vhostbackup.localhost/setConfig?ContainerList=vhost1,vhost2,api&ContainerExceptionList=caddy,vhostbackup

#### Passwords

vhost1:

    admin:adminpass

vhos2:

    user1:user1pass

vhostbackup:

    admin:user2pass

monitoring:

    admin:monitoring
