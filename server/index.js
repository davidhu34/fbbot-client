"use strict"
//var debug = require('debug')('REM:server');
const http = require('http')
const path = require('path')
const express = require('express')
const fbbot = require('messenger-bot')



const { normalizePort, onError, onListening } = require('./util')
const applyMiddlewares = require('./middlewares')

let bot = new fbbot({
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
//http.createServer(bot.middleware()).listen(3000)

const app = express()
applyMiddlewares( app )
const PORT = 3006
const port = normalizePort( process.env.PORT || PORT )
app.set( 'port', port )
app.use( express.static( path.join( __dirname, '..', 'public' ) ) )
app.get('/webhook', (req, res) => {
  return bot._verify(req, res)
})

// web port

app.get( '/', (req, res, next) => {
    res.sendFile( path.join( __dirname, '..', 'index.html' ) )
})


const server = http.createServer( app )
server.listen( port )
server.on( 'error', onError( port ) )
server.on( 'listening', onListening( server ) )
