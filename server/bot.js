const md5 = require('md5')
const { iot_client } = require('./config')
const events = require('events')

let conversations = {}
const bot = new event()
const rc = rc(bot)

bot.on('queston', (data) => {
    const id = md5(data+time.toString())
    const conversation = conversation[id] = {
        id: id,
        question: data,
        reply: {}
    }
    this.execute('rc', conversation)
    this.send('watson', conversation)
})
bot.on('rc', (id, text) => {
    conversation[id].reply.rc = text
    if( conversation[id].reply.watson )
        this.execute('create_wav', conversation[id])
})
class bot extends events {
    constructor (emitter) {
        this.emitter = emitter
        this.rc = rc(emitter)
        micInput(emitter)
    }
    receive (from, data) {
        //debug.receive(from, data)
        this.emit(from, data)
    }
    send (to, data) {
        switch (to) {
            case 'watson':
                const payload = {d:{
                    "mid": data.id,
                    "text": buf.toString() || {},
                    "eventId": '',
                    "eventUser": ''
                }}
                iot_client.publish(
                    'iot-2/evt/text/fmt/json',
                    JSON.stringify(payload)
                )
                break;
            default:
        }
    }


}
