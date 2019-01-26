const express = require( 'express' );
const SocketServer = require( 'ws' ).Server;

const PORT = process.env.PORT || 8080;

const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use( express.static( 'public' ) )
  .listen( PORT, '0.0.0.0', 'localhost', () => console.log( `Listening on ${PORT}` ) );

const wss = new SocketServer( {
  server,
} );

wss.on( 'connection', ( socket ) => {
  socket.on( 'message', ( data ) => {
    wss.clients.forEach( ( client ) => {
      client.send( data );
    } );
  } );
} );

