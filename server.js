const express = require( 'express' );

const app = express();
const PORT = process.env.PORT || 8080;

app.listen( PORT, () => {
  console.log( `Collaborative Drawing Server listening on port ${PORT}` );
} );

app.get( '/', ( req, res ) => {
  console.log( 'Received Request' );
} );
