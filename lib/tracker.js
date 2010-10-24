
var http = require('http');
var handlers = require('./handlers.js');
var dispatcher = require('./dispatcher.js');

var pool = new (require('./pool_dummy.js').Pool)();

handlers.announce.pool = pool;

var dispatch = dispatcher.forHandlers({
  "/announce": handlers.announce
});

http.createServer(function(request, response) {
  console.log("Incoming request to url", request.url);
  dispatch(request, response);
}).listen(8080);
