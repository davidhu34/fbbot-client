"use strict"
//var debug = require('debug')('REM:server');
const http = require('http')
const path = require('path')
const express = require('express')
//const fbbot = require('messenger-bot')
const botly = require('botly')

const { normalizePort, onError, onListening } = require('./util')
const applyMiddlewares = require('./middlewares')

const app = express()
applyMiddlewares( app )
const PORT = 3005
const port = normalizePort( process.env.PORT || PORT )
app.set( 'port', port )
app.use( express.static( path.join( __dirname, '..', 'public' ) ) )

const iot = require('./iot')
//const users = require('./users')

const bot = new botly({
    verifyToken: "verification",
    accessToken: "EAAJ1qMtnld8BAI52ZBPcOPppkdRUkCB6rZCbeIayhnpNsWltaBQkcGVay0rHhgBA7oXEjD1RfbdHrZAUDZAH6hZCNc4CY1SiJ9m5JJyNTgEVIuE05vHzACJ9JpHLNy2ZCHnC66hOQlRUujBXjb6oBFuG94TaztRPUiOwCTYdD9ZCQZDZD"
})
const send = require('./fbSend')(bot)

iot.on('message', (t, bufferP) => {
    console.log('receive iot payload')
    const payload = JSON.parse(bufferP)
    console.log('topic:', t,'payload:',payload)
    send(payload)
})


bot.on('message', (sender, message, data) => {
	console.log('receive message', sender, message, data)
    iot.publish('iot-2/evt/restaurant/fmt/json',
        JSON.stringify({
            sender: sender,
            mid: message.mid,
            type: 'text',
            data: data.text
        })
    )
	bot.send({
		id: sender,
		message:{
			text: 'loolol'
		}
	}, (err, data) => {
		if (err) console.log('err:', err)
		else console.log('msg sent:', data)
	})
})
bot.on('postback', (sender, message, payload) => {
    console.log('receive postback:', sender, message, payload)
    send(payload)
})



app.use('/fbwebhook', bot.router())
/*let bot = new fbbot({
	token: 'EAAJ1qMtnld8BAFfoNmK8cNWdZC1smVKB8DknlENZADZAUlhG0ZButwJC9oqVPj8Jz6DOJbvBLxOQBZANBHz1TML3lomI6bsIegA7LUvLeQlRmT7OxOi9t7yitEw8IFQBnudDBp8sLFnOK9ydZBzOprxQCEu0Jejcg84excAh1BNQZDZD',
	verify: 'verification',
	app_secret: 'secret'
})
bot.on('message', (payload, reply, actions) => {
	console.log('got msg', payload)
	reply({text:'dude'}, () => {console.log('replied')} )
})
bot.on('error', (err) => {
  console.log(err.message)
})
http.createServer(bot.middleware()).listen(3000)
app.get('/webhook', (req, res) => {
  return bot._verify(req, res)
})*/


// web port
app.get( '/', (req, res, next) => {
    res.sendFile( path.join( __dirname, '..', 'index.html' ) )
})


const server = http.createServer( app )
server.listen( port )
console.log('on')
server.on( 'error', onError( port ) )
server.on( 'listening', onListening( server ) )
