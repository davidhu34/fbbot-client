const md5 = require('md5')
const { iot_client } = require('./config')
const events = require('events')
const iconv = require('iconv')


let conversations = {}
const bot = new event()
const runRc = rc(bot)
micInput(bot)
watsonInput(bot)

const execute = (task, data) => {
    switch (task) {
        case 'rc':
            const conversation = data
            runRc(conversation.question)
            break;
        case 'create_wav':
            const { rc, watson } = data.reply
            if (rc.hasAnswer) {
                createWAV(rc.text)
                if (watson.hasAnswer)
                    createWAV(watson.text)
            } else createWAV(watson.text)
    }
}

const send = (to, data) {
    switch (to) {
        case 'watson':
            const payload = {d:{
                "mid": data.id,
                "text": iconv.encode(data.question, 'UTF8').toString() || {},
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

bot.on('queston', (data) => {
    const id = md5(data+time.toString())
    const conversation = conversation[id] = {
        id: id,
        question: data,
        reply: {}
    }
    execute('rc', conversation)
    send('watson', conversation)
})
bot.on('rc', (id, text) => {
    conversation[id].reply.rc = {
        text: text,
        hasAnswer: text !== ''
    }
    if( conversation[id].reply.watson )
        execute('create_wav', conversation[id])
})
bot.on('watson', (id, hasAnswer, text) => {
    conversation[id].reply.watson = {
        text, hasAnswer
    }
    if( conversation[id].reply.rc )
        execute('create_wav', conversation[id])
})

module.exports = bot
