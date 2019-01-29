const express = require( 'express' );
const SocketServer = require( 'ws' ).Server;

const PORT = process.env.PORT || 8080;
const history = [];
let tempHistory = [];
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use( express.static( 'public' ) )
  .listen( PORT, '0.0.0.0', 'localhost', () => console.log( `Listening on ${PORT}` ) );

const wss = new SocketServer( {
  server,
} );

wss.on( 'connection', ( socket ) => {
  wss.clients.forEach( ( client ) => {
    for ( let i = 0; i < history.length; i += 1 ) {
      client.send( JSON.stringify( history[i] ) );
    }
  } );

  socket.on( 'message', ( data ) => {
    const parsedData = JSON.parse( data );
    if ( parsedData.completed ) {
      history.push( tempHistory );
      tempHistory = [];
    } else {
      tempHistory.push( parsedData );
      wss.clients.forEach( ( client ) => {
        client.send( JSON.stringify( tempHistory ) );
      } );
    }
  } );
} );

