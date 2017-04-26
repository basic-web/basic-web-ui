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
$ docker pull carmark/seaweedfs
$ docker network create dev
$ docker run --name redis --net dev -d redis
$ docker-compose -f ./docker-compose-seaweedfs.yml up -d
$ docker run -it --rm --name basic-web-ui -p 3000:3000 \
   --net dev --link redis:redis \
   --link seaweedfs_master:seaweedfs_master --link seaweedfs_data1:seaweedfs_data1 \
   --link basic-service:basic-service \
   -v "$PWD":/usr/src/app -w /usr/src/app node /bin/bash
$ root@b6029a99608a:/usr/src/app# DEBUG=basic-web-ui:* node app.js
```

### Connect to redis container

```
$ docker run -it --link redis:redis --rm redis redis-cli -h redis -p 6379
```