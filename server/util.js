module.exports = {
// Normalize a port into a number, string, or false.
normalizePort: ( val ) => {
    const port = parseInt( val, 10 )

    if ( isNaN( port ) )
        return val  // named pipe

    if ( port >= 0 )
        return port // port number

    return false
},

// Event listener for HTTP server "error" event.
onError: ( port ) => ( error ) => {
    if ( error.syscall !== 'listen' )
        throw error
        console.log(port)
    const bind = ( typeof port === 'string' )
         ? ( 'Pipe ' + port )
         : ( 'Port ' + port )

    // handle specific listen errors with friendly messages
    switch ( error.code ) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
},

// Event listener for HTTP server "listening" event.
onListening: ( server ) => () => {
    const addr = server.address()
    const bind = ( typeof addr === 'string' )
        ? 'pipe ' + addr
        : 'port ' + addr.port
    // debug( 'Listening on ' + bind )
}
}
