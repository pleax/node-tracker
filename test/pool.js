var assert = require('assert');
var Pool = require('../lib/pool_dummy.js').Pool;

// fixtures... kinda :)

var infoHash = "00000000000000000001";
var peer = {
  id: "peerId-0000000000001",
  ip: "192.0.32.10",
  port: 6337
};
var peer2 = {
  id: 'TorrentPeer-42-2',
  ip: 'peer2.example.com',
  port: 6881
};

// pool with no peers returns zero counts for any new infoHash
(function() {
  var pool = new Pool();
  assert.deepEqual(pool.getInfo(infoHash), { complete: 0, incomplete: 0 });
})();

// counts peer as leecher if left > 0
(function() {
  var pool = new Pool();
  pool.update(infoHash, peer, { left: 10 });
  assert.deepEqual(pool.getInfo(infoHash), { complete: 0, incomplete: 1 });
})();

// counts peer as seeder if left == 0
(function() {
  var pool = new Pool();
  pool.update(infoHash, peer, { left: 0 });
  assert.deepEqual(pool.getInfo(infoHash), { complete: 1, incomplete: 0 });
})();

// changes status of peer from incomplete to complete
(function() {
  var pool = new Pool();
  pool.update(infoHash, peer, { left: 10 });
  assert.deepEqual(pool.getInfo(infoHash), { complete: 0, incomplete: 1 });
  pool.update(infoHash, peer, { left: 0 });
  assert.deepEqual(pool.getInfo(infoHash), { complete: 1, incomplete: 0 });
})();

// removes peer on 'stopped' event
(function() {
  var pool = new Pool();
  pool.update(infoHash, peer, { left: 0 });
  assert.deepEqual(pool.getInfo(infoHash), { complete: 1, incomplete: 0 });
  pool.update(infoHash, peer, { left: 0 }, 'stopped');
  assert.deepEqual(pool.getInfo(infoHash), { complete: 0, incomplete: 0 });
})();

// remove peer on 'stopped' event doesn't touch other peers
(function() {
  var pool = new Pool();
  pool.update(infoHash, peer, { left: 0 });
  assert.deepEqual(pool.getInfo(infoHash), { complete: 1, incomplete: 0 });
  pool.update(infoHash, peer2, { left: 0 });
  assert.deepEqual(pool.getInfo(infoHash), { complete: 2, incomplete: 0 });
  pool.update(infoHash, peer, { left: 0 }, 'stopped');
  assert.deepEqual(pool.getInfo(infoHash), { complete: 1, incomplete: 0 });
})();

// returns empty list of peers for any new infoHash
(function() {
  var pool = new Pool();
  assert.deepEqual(pool.getPeers(infoHash, peer, 10), []);
})();

// returns some active peers for given infoHash
(function() {
  var pool = new Pool();
  pool.update(infoHash, peer, { left: 0 });
  pool.update(infoHash, peer2, { left: 0 });
  assert.ok(pool.getPeers(infoHash, peer, 10).length > 0);
})();

// doesn't return client which requests peers
(function() {
  var pool = new Pool();
  pool.update(infoHash, peer, { left: 0 });
  pool.update(infoHash, peer2, { left: 0 });
  assert.ok(pool.getPeers(infoHash, peer, 10).every(function(p) {
    return p.id != peer.id;
  }));
})();

// returns not more than <wants> peers for given infoHash
(function() {
  var pool = new Pool();
  for (var i = 0; i < 30; i++) {
    pool.update(infoHash, { id: "peer-" + i, ip: "192.0.32.10", port: 6881 }, { left: 0 });
  }
  assert.ok(pool.getPeers(infoHash, peer, 5).length <= 5);
})();
