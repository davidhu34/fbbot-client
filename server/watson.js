const watson = require('watson-developer-cloud')
const mqtt = require('mqtt')
const mqttClient = mqtt.createClient(1883, 'iot.eclipse.org')

const speech_to_text = watson.speech_to_text({
    username: 'c8090707-bcda-49e0-98f9-172c40420c1a',
    password: 'cZGWayUpvsSJ',
    version: 'v1'
})

const ConversationV1 = require('watson-developer-cloud/conversation/v1') // watson sdk
// Create the service wrapper
const conversation = new ConversationV1({
    // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
    // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
    username: '3edc3475-3b0a-42bd-8340-02610eff4eec',
    password: '0ZZorZGLewyG',
    version_date: ConversationV1.VERSION_DATE_2016_09_20
})
const clientId = ['d', "j6w08m", "robot", "phone02"].join(':')
const iot_client = mqtt.connect(
    "mqtt://j6w08m.messaging.internetofthings.ibmcloud.com:1883",
    {
        "clientId" : clientId,
        "keepalive" : 30,
        "username" : "use-token-auth",
        "password" : "852852852"
    }
)
iot_client.on('connect', function() {
    console.log('Temp client connected to IBM IoT Cloud.')
    iot_client.publish('iot-2/evt/temp/fmt/json', '{"d":{"temp": ""connectd"" }}')
})
iot_client.subscribe('iot-2/cmd/+/fmt/+', function(err, granted) {
    console.log('subscribed command, granted: '+ JSON.stringify(granted))
})

module.exports = { iot_client, speech_to_text }
