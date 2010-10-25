
var assert = require('assert');
var b = require('../lib/bencode.js');

(function() {
  assert.equal(b.encode(10), "i10e");
})();

(function() {
  assert.equal(b.encode(0), "i0e");
})();

(function() {
  assert.equal(b.encode("string"), "6:string");
})();

(function() {
  assert.equal(b.encode(""), "0:");
})();

(function() {
  assert.equal(b.encode("\x01string\x02"), "8:\x01string\x02");
})();

(function() {
  assert.equal(b.encode([1, 2, 3]), "li1ei2ei3ee");
})();

(function() {
  assert.equal(b.encode(["abc", 2, 3]), "l3:abci2ei3ee");
})();

(function() {
  assert.equal(b.encode(["abc", [1, 2], 3]), "l3:abcli1ei2eei3ee");
})();

(function() {
  assert.equal(b.encode({ "d-o": { k: "v" } }), "d3:d-od1:k1:vee");
})();

(function() {
  assert.equal(b.encode({ 0: " - ", k: "abc", b: 42, c: [1, "def"], "d-o": { k: "v" } }),
    "d1:03: - 1:bi42e1:cli1e3:defe3:d-od1:k1:ve1:k3:abce");
})();
