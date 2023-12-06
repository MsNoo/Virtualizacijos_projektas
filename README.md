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

    admin:adminpass

monitoring:

    admin:monitoring
