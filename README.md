## Virtualizacijos projektas

### Pasileidimas

Unix:

```bash
colima start && docker-compose up
```

No cache:

```bash
docker-compose up --force-recreate --build
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

    admin:user1pass

vhostbackup:

    admin:user2pass

monitoring:

    admin:monitoring

