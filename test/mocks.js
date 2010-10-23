var url = require('url');
var qs = require('querystring');
var utils = require('../lib/utils.js');

var mockRequest = exports.mockRequest = function(options) {
  var options = options || {};
  return {
    url: options.url || '/',
    connection: options.connection
  };
};

var mockResponse = exports.mockResponse = function(options) {
  var options = options || {};
  return {
    writeHead: options.writeHead || utils.returnThis,
    write: options.write || utils.returnThis,
    end: options.end || utils.returnThis
  };
};

var mockContext = exports.mockContext = function(requestOpts, responseOpts) {
  var responseOpts = responseOpts || {};
  var responseOpts = responseOpts || {};

  var request = mockRequest(requestOpts);
  var response = mockResponse(responseOpts);

  var tokens = url.parse(request.url);
  var params = qs.parse(tokens.query);

  return {
    params: params,
    url: tokens,
    request: request,
    response: response
  };
};
