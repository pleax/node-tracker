
var utils = require('./utils.js');

var Pool = exports.Pool = function() {
  this.torrents = {};
};

Pool.prototype.getInfo = function(infoHash) {
  var complete = 0;
  var incomplete = 0;
  var torrent = this.torrents[infoHash];
  for (var peerId in (torrent && torrent.peers || {})) {
    var metrics = torrent.peers[peerId].metrics;
    var left = metrics && metrics.left || 0;
    if (left > 0) {
      incomplete += 1;
    } else {
      complete += 1;
    }
  }
  return { complete: complete, incomplete: incomplete };
};

Pool.prototype.getPeers = function(infoHash, peer, numWant) {
  var torrent = this.torrents[infoHash];
  var wantedPeers = [];
  for (var peerId in (torrent && torrent.peers || {})) {
    if (wantedPeers.length >= numWant) break;
    if (peerId == peer.id) continue;
    var wantedPeer = torrent.peers[peerId];
    wantedPeers.push({ id: peerId, ip: wantedPeer.ip, port: wantedPeer.port });
  }
  return wantedPeers;
};

Pool.prototype.update = function(infoHash, peerInfo, metricsInfo, event) {
  var torrent = this.torrents[infoHash];
  if (torrent == null) {
    torrent = this.torrents[infoHash] = { peers: {} };
  }

  if (event == 'stopped') {
    delete torrent.peers[peerInfo.id];
  } else {
    var peer = torrent.peers[peerInfo.id];
    if (peer == null) {
      peer = torrent.peers[peerInfo.id] = { metrics: {} };
    }
    peer.ip = peerInfo.ip;
    peer.port = peerInfo.port;
    peer.metrics = { uploaded: metricsInfo.uploaded, downloaded: metricsInfo.downloaded, left: metricsInfo.left };
  }

  // TODO: remove outdated peers and torrents without peers
};
