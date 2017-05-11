'use strict';

const Kafka = require('node-rdkafka');
const _ = require('lodash');
const debug = require('debug')('basic-web-ui:debug');
const config = require('../../config');

module.exports = (container) => {
    const consumer = new Kafka.KafkaConsumer(config.kafka.message, {});
    consumer.connect();
    consumer
        .on('ready', function () {
            consumer.subscribe(['messages']);
            consumer.consume();
        }).on('data', function (data) {
            try {
                const message = JSON.parse(data.value.toString());
                _.forIn(container.get(message.dest), socket => {
                    if (socket) {
                        socket.emit('message', message);
                    }
                });
            } catch (err) {
                debug('parse received message data error', err);
            }
        });
};