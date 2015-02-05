
var through = require('through2'),
    BatchManager = require('./BatchManager'),
    winston = require('winston');

function streamFactory( opts ){
  winston.remove( winston.transports.Console );
  winston.add( winston.transports.Console, {
    timestamp: true, colorize: true
  });

  opts = opts || {};
  if( !opts.client ){ opts.client = require('./client')(); }

  var manager = new BatchManager( opts );

  var stream = through.obj( function( item, enc, next ){
    manager.push( item, next );
  }, function(){
    manager.end();
  });

  // export client
  stream.client = opts.client;

  return stream;
}

module.exports = streamFactory;
