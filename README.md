Basic Web UI
============

## Developing in docker

### Install container and run app

```
$ docker pull redis
$ docker pull node
$ docker run --name redis -d redis
$ docker run -it --rm --name basic-web-ui -p 3000:3000 --link redis:redis -v "$PWD":/usr/src/app -w /usr/src/app node /bin/bash
$ root@b6029a99608a:/usr/src/app# DEBUG=basic-web-ui:* node app.js
```

### Connect to redis container

```
$ docker run -it --link redis:redis --rm redis redis-cli -h redis -p 6379
```