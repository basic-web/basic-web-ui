'use strict';

const config = {
    app: {
        name: 'Basic Web UI!'
    },
    upload: {
        dir: '/tmp/'
    },
    seaweedfs: {
        master: 'http://seaweedfs_master:9333'
    },
    redis: {
        host: 'redis',
        port: '6379'
    },
    session: {
        secret: 'safd2#$d&323_Fe@r15OopWk',
        ttl: 86400
    },
    service: {
        base: 'http://basic-service:9000'
    }
};

module.exports = config;
