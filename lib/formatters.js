
var b = require('./bencode.js');

exports.announce = function(torrentInfo, wantedPeers) {
  return b.encode({
    interval: 10, // TODO: hardcode must be replaced with configurable value
    complete: torrentInfo.complete,
    incomplete: torrentInfo.incomplete,
    peers: peers(wantedPeers)
  });
};

var peers = function(peers) {
  return peers.map(function(peer) {
    return {
      "peer id": peer.id,
      "ip": peer.ip,
      "port": peer.port
    };
  });
};

