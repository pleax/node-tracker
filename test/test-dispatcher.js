
var assert = require('assert');
var dispatcher = require('../lib/dispatcher.js');
var utils = require('../lib/utils.js');
var mocks = require('./mocks.js');

(function() {
  var executed = false;
  var handleAnnounce = function() { executed = true };
  var dispatch = dispatcher.forHandlers({
    "/announce": handleAnnounce
  });
  dispatch(mocks.mockRequest({ url: '/announce?info_hash=12345678901234567890' }), mocks.mockResponse());
  assert.ok(executed);
})();

(function() {
  var executed = false;
  var dispatch = dispatcher.forHandlers({});
  var request = mocks.mockRequest({ url: '/unknown' });
  var response = mocks.mockResponse({
    writeHead: function(code) { if (code == 404) executed = true; }
  });
  dispatch(request, response);
  assert.ok(executed);
})();
