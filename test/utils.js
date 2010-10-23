var assert = require('assert');
var utils = require('../lib/utils.js');

(function() {
  var that = { key: "value" };
  assert.equal(utils.returnThis.call(that, "any", "arguments", "should", "be", "accepted"), that);
})();

(function() {
  var that = { key: "value", returnThis: utils.returnThis };
  assert.equal(that.returnThis("any", "arguments", "should", "be", "accepted"), that);
})();
