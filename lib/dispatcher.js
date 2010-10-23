var url = require('url');
var qs = require('querystring');

var forHandlers = exports.forHandlers = function(handlers) {
  return function(request, response) {
    var tokens = url.parse(request.url);
    var params = qs.parse(tokens.query);

    var ctx = {
      params: params,
      url: tokens,
      request: request,
      response: response
    };

    console.log("Ctx:", JSON.stringify(ctx));

    (handlers[ctx.url.pathname] || handle404)(ctx);
  };
};

var handle404 = function(ctx) {
  ctx.response.writeHead(404, { 'Content-Type': 'text/plain' });
  ctx.response.end();
};
