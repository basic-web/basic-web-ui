Basic Web UI
============

## Install develop environment

```
$ sudo apt-get install ruby
$ sudo gem install sass
$ sudo cnpm install bower -g
$ sudo cnpm install gulp -g
$ git clone https://github.com/basic-web/basic-web-ui.git
$ cd basic-web-ui
$ cnpm install
$ bower install
$ gulp
```

## Developing in docker

### Install container and run app

```
$ docker pull redis
$ docker pull node
$ docker run --name redis -d redis
$ docker run -it --rm --name basic-web-ui -p 3000:3000 \
   --link redis:redis --link basic-service:basic-service \
   -v "$PWD":/usr/src/app -w /usr/src/app node /bin/bash
$ root@b6029a99608a:/usr/src/app# DEBUG=basic-web-ui:* node app.js
```

### Connect to redis container

```
$ docker run -it --link redis:redis --rm redis redis-cli -h redis -p 6379
```