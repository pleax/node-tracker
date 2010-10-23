var assert = require('assert');
var handlers = require('../lib/handlers.js');
var formatters = require('../lib/formatters.js');
var utils = require('../lib/utils.js');
var mocks = require('./mocks.js');

var generateAnnounceUrl = function(options) {
  var options = options || {};
  var tokens = [];
  tokens.push("info_hash=" + (options.infoHash || "12345678901234567890"));
  tokens.push("peer_id=" + (options.peerId || "peerId-8901234567890"));
  tokens.push("port=" + (options.port || 6883));
  tokens.push("uploaded=" + (options.uploaded || 0));
  tokens.push("downloaded=" + (options.downloaded || 0));
  tokens.push("left=" + (options.left || 0));
  if (options.compact != null) {
    tokens.push("compact=" + (options.compact ? '1' : '0'));
  }
  if (options.event) {
    tokens.push("event=" + options.event);
  }
  if (options.ip) {
    tokens.push("ip=" + options.ip);
  }
  if (options.numWant) {
    tokens.push("numwant=" + options.numWant);
  }
  return "/announce?" + tokens.join('&');
};

var mockPool = function(options) {
  var options = options || {};
  return {
    update: options.update || utils.noop,
    expire: options.expire || utils.noop,
    getInfo: options.getInfo || function() {
      return { complete: 0, incomplete: 0 };
    },
    getPeers: options.getPeers || function() { return []; }
  };
};

(function() {
  var resposeFinished = false;
  var ctx = mocks.mockContext({
    url: generateAnnounceUrl(),
    connection: { remoteAddress: "192.0.32.10" }
  }, {
    end: function() { resposeFinished = true; }
  });
  handlers.announce.pool = mockPool();
  handlers.announce(ctx);
  assert.ok(resposeFinished);
})();

(function() {
  var resposeCodeOk = false;
  var ctx = mocks.mockContext({
    url: generateAnnounceUrl(),
    connection: { remoteAddress: "192.0.32.10" }
  }, {
    writeHead: function(code) { if (code == 200) resposeCodeOk = true; }
  });
  handlers.announce.pool = mockPool();
  handlers.announce(ctx);
  assert.ok(resposeCodeOk);
})();

(function() {
  var updateFired = false;
  var ctx = mocks.mockContext({
    url: generateAnnounceUrl(),
    connection: { remoteAddress: "192.0.32.10" }
  });
  handlers.announce.pool = mockPool({
    update: function() { updateFired = true; }
  });
  handlers.announce(ctx);
  assert.ok(updateFired);
})();

(function() {
  var expireFired = false;
  var ctx = mocks.mockContext({
    url: generateAnnounceUrl(),
    connection: { remoteAddress: "192.0.32.10" }
  });
  handlers.announce.pool = mockPool({
    expire: function() { expireFired = true; }
  });
  handlers.announce(ctx);
  assert.ok(expireFired);
})();

(function() {
  var infoRequested = false;
  var ctx = mocks.mockContext({
    url: generateAnnounceUrl(),
    connection: { remoteAddress: "192.0.32.10" }
  });
  handlers.announce.pool = mockPool({
    getInfo: function() { infoRequested = true; return { complete: 0, incomplete: 0 }; }
  });
  handlers.announce(ctx);
  assert.ok(infoRequested);
})();

(function() {
  var peersRequested = false;
  var ctx = mocks.mockContext({
    url: generateAnnounceUrl(),
    connection: { remoteAddress: "192.0.32.10" }
  });
  handlers.announce.pool = mockPool({
    getPeers: function() { peersRequested = true; return []; }
  });
  handlers.announce(ctx);
  assert.ok(peersRequested);
})();

(function() {
  var responseText = "";
  var ctx = mocks.mockContext({
    url: generateAnnounceUrl(),
    connection: { remoteAddress: "192.0.32.10" }
  }, {
    write: function(data, enc) { responseText += data; },
    end: function(data, enc) { if (data) responseText += data; }
  });
  var pool = handlers.announce.pool = mockPool({
    getPeers: function() {
      return [
        { id: "peerId-8901234567890", ip: "192.0.32.10", port: 6337 },
        { id: "peerId-8901234567890", ip: "192.0.32.10", port: 6339 }
      ];
    }
  });
  handlers.announce(ctx);
  assert.equal(responseText, formatters.announce(pool.getInfo(), pool.getPeers()));
})();

(function() {
  var responseText = "";
  var ctx = mocks.mockContext({
    url: generateAnnounceUrl({ compact: true }),
    connection: { remoteAddress: "192.0.32.10" }
  }, {
    write: function(data, enc) { responseText += data; },
    end: function(data, enc) { if (data) responseText += data; }
  });
  var pool = handlers.announce.pool = mockPool({
    getPeers: function() {
      return [
        { id: "peerId-8901234567890", ip: "192.0.32.10", port: 6337 },
        { id: "peerId-8901234567890", ip: "192.0.32.10", port: 6339 }
      ];
    }
  });
  handlers.announce(ctx);
  assert.equal(responseText, formatters.announce(pool.getInfo(), pool.getPeers(), true));
})();
