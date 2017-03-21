"use strict";

var MQTT = {
    url: "mqtt://j6w08m.messaging.internetofthings.ibmcloud.com:1883",
    opts: {
        "clientId": ['d', "j6w08m", "WebAP", "chat"].join(':'),
        "keepalive": 30,
        "username": "use-token-auth",
        "password": "123qweasd"
    }
};
var PORT = '5000';
var MONGOURI = 'mongodb://davidhu34:123qweasd@ds139685.mlab.com:39685/chat2016';

module.exports = {
    PORT: PORT,
    MONGOURI: MONGOURI,
    MQTT: MQTT
};