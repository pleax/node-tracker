
var assert = require('assert');
var b = require('../lib/bencode.js');
var formatters = require('../lib/formatters.js');

(function() {
  var torrentInfo = {
    complete: 0,
    incomplete: 0
  };
  var wantedPeers = [];
  assert.equal(formatters.announce(torrentInfo, wantedPeers), b.encode({
    interval: 10,
    complete: 0,
    incomplete: 0,
    peers: []
  }));
})();

(function() {
  var torrentInfo = {
    complete: 10,
    incomplete: 30
  };
  var wantedPeers = [];
  assert.equal(formatters.announce(torrentInfo, wantedPeers), b.encode({
    interval: 10,
    complete: 10,
    incomplete: 30,
    peers: []
  }));
})();

(function() {
  var torrentInfo = {
    complete: 10,
    incomplete: 30
  };
  var wantedPeers = [
    { id: "peerId-8901234567890", ip: "192.0.32.10", port: 6337 }
  ];
  assert.equal(formatters.announce(torrentInfo, wantedPeers), b.encode({
    interval: 10,
    complete: 10,
    incomplete: 30,
    peers: [
      { "peer id": "peerId-8901234567890", ip: "192.0.32.10", port: 6337 }
    ]
  }));
})();

(function() {
  var torrentInfo = {
    complete: 10,
    incomplete: 30
  };
  var wantedPeers = [
    { id: "peerId-8901234567890", ip: "192.0.32.10", port: 6337 },
    { id: "peerId-8901234567890", ip: "192.0.32.10", port: 6339 }
  ];
  assert.equal(formatters.announce(torrentInfo, wantedPeers), b.encode({
    interval: 10,
    complete: 10,
    incomplete: 30,
    peers: [
      { "peer id": "peerId-8901234567890", ip: "192.0.32.10", port: 6337 },
      { "peer id": "peerId-8901234567890", ip: "192.0.32.10", port: 6339 }
    ]
  }));
})();


(function() {
  var torrentInfo = {
    complete: 0,
    incomplete: 0
  };
  var wantedPeers = [];
  assert.equal(formatters.announce(torrentInfo, wantedPeers, true), b.encode({
    interval: 10,
    complete: 0,
    incomplete: 0,
    peers: ""
  }));
})();

(function() {
  var torrentInfo = {
    complete: 10,
    incomplete: 30
  };
  var wantedPeers = [];
  assert.equal(formatters.announce(torrentInfo, wantedPeers, true), b.encode({
    interval: 10,
    complete: 10,
    incomplete: 30,
    peers: ""
  }));
})();

(function() {
  var torrentInfo = {
    complete: 10,
    incomplete: 30
  };
  var wantedPeers = [
    { id: "peerId-8901234567890", ip: "192.0.32.10", port: 6337 }
  ];
  assert.equal(formatters.announce(torrentInfo, wantedPeers, true), b.encode({
    interval: 10,
    complete: 10,
    incomplete: 30,
    peers: "\xc0\x00\x20\x0a\x18\xc1"
  }));
})();

(function() {
  var torrentInfo = {
    complete: 10,
    incomplete: 30
  };
  var wantedPeers = [
    { id: "peerId-8901234567890", ip: "192.0.32.10", port: 6337 },
    { id: "peerId-8901234567890", ip: "192.0.32.10", port: 6339 }
  ];
  assert.equal(formatters.announce(torrentInfo, wantedPeers, true), b.encode({
    interval: 10,
    complete: 10,
    incomplete: 30,
    peers: "\xc0\x00\x20\x0a\x18\xc1\xc0\x00\x20\x0a\x18\xc3"
  }));
})();

(function() {
  var torrentInfo = {
    complete: 10,
    incomplete: 30
  };
  var wantedPeers = [
    { id: "peerId-8901234567890", ip: "example.com", port: 6337 }
  ];
  assert.equal(formatters.announce(torrentInfo, wantedPeers, true), b.encode({
    interval: 10,
    complete: 10,
    incomplete: 30,
    peers: ""
  }));
})();

(function() {
  var torrentInfo = {
    complete: 10,
    incomplete: 30
  };
  var wantedPeers = [
    { id: "peerId-8901234567890", ip: "a.b.example.com", port: 6337 }
  ];
  assert.equal(formatters.announce(torrentInfo, wantedPeers, true), b.encode({
    interval: 10,
    complete: 10,
    incomplete: 30,
    peers: ""
  }));
})();

