"use strict"
//var debug = require('debug')('REM:server');
const http = require('http')
const path = require('path')
const socketio = require('socket.io');
const express = require('express');

const { PORT, MONGOURI } = require('./config')
const { normalizePort, onError, onListening } = require('./util')
const applyMiddlewares = require('./middlewares')
const api = require('./api')
const mongo = require('./db')

const app = express()
applyMiddlewares( app )

const port = normalizePort( process.env.PORT || PORT )
app.set( 'port', port )
app.use( express.static( path.join( __dirname, '..', 'public' ) ) )


// web port
app.get( '/', (req, res, next) => {
    res.sendFile( path.join( __dirname, '..', 'index.html' ) )
})

const server = http.createServer( app )
const io = new socketio(server)
const models = mongo( MONGOURI )
app.use( '/', api( io, models ) )

server.listen( port )
server.on( 'error', onError( port ) )
server.on( 'listening', onListening( server ) )
