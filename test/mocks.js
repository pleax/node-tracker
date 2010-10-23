var utils = require('../lib/utils.js');

var mockRequest = exports.mockRequest = function(options) {
  var options = options || {};
  return {
    url: options.url || '/'
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

