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
- Bad path:
  - http://vhost1.localhost/.htaccess

#### Passwords

adminpass
user1pass
user2pass
