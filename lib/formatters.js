
var b = require('./bencode.js');

exports.announce = function(torrentInfo, wantedPeers, compact) {
  var peers = compact ? peersBinary : peersDictionary;
  return b.encode({
    interval: 10, // TODO: hardcode must be replaced with configurable value
    complete: torrentInfo.complete,
    incomplete: torrentInfo.incomplete,
    peers: peers(wantedPeers)
  });
};

exports.scrape = function(infoHash,torrentInfo) {
    return b.encode({
        file: infoHash,
        complete:   torrentInfo.complete,
        incomplete: torrentInfo.incomplete,
        downloaded: torrentInfo.downloaded
    });
};

var peersDictionary = function(peers) {
  return peers.map(function(peer) {
    return {
      "peer id": peer.id,
      "ip": peer.ip,
      "port": peer.port
    };
  });
};

var peersBinary = function(peers) {
  var tokens = [];
  peers.forEach(function(peer) {
    tokens.push(peerBinary(peer.ip, peer.port));
  });
  return tokens.join('');
};

var peerBinary = function(ip, port) {
  var tokens = [];

  var octets = ip.split('.');
  if (octets.length != 4) return "";

  octets.forEach(function(octet) {
    var val = parseInt(octet, 10);
    if (!isNaN(val)) tokens.push(val);
  });
  if (tokens.length != 4) return "";

  tokens.push((port & 0xff00) >> 8);
  tokens.push(port & 0xff);

  return String.fromCharCode.apply(tokens, tokens);
};

