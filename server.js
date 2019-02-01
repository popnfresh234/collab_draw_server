const express = require( 'express' );
const SocketServer = require( 'ws' ).Server;

const PORT = process.env.PORT || 8080;
let history = [];
let tempHistory = [];
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use( express.static( 'public' ) )
  .listen( PORT, '0.0.0.0', 'localhost', () => console.log( `Listening on ${PORT}` ) );

const wss = new SocketServer( {
  server,
} );


wss.on( 'connection', ( socket ) => {
  socket.send( JSON.stringify( { type: 'grid' } ) );

  wss.clients.forEach( ( client ) => {
    for ( let i = 0; i < history.length; i += 1 ) {
      client.send( JSON.stringify( { type: 'line', data: history[i] } ) );
    }
  } );

  socket.on( 'message', ( data ) => {
    const parsedData = JSON.parse( data );
    const msgTypeLookup = {
      clear: () => {
        history = [];
        wss.clients.forEach( ( client ) => {
          client.send( JSON.stringify( { type: 'clear' } ) );
        } );
      },
      line: () => {
        tempHistory.push( parsedData.data );
        wss.clients.forEach( ( client ) => {
          client.send( JSON.stringify( { type: 'line', data: tempHistory } ) );
        } );
      },
      completed: () => {
        history.push( tempHistory );
        tempHistory = [];
      },
    };
    const fn = msgTypeLookup[parsedData.type];
    if ( fn ) fn( parsedData );
  } );
} );

