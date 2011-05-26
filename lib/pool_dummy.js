
var utils = require('./utils.js');

var Pool = exports.Pool = function() {
  this.torrents = {};
};

Pool.prototype.getInfo = function(infoHash) {
  var complete = 0;
  var incomplete = 0;
  var torrent = this.torrents[infoHash];
  return {  complete: torrent.complete,
            incomplete: torrent.peer_count - torrent.complete,
            downloaded: torrent.downloaded
            };
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
    torrent = this.torrents[infoHash] = { peers: {},
                                          downloaded: 0,
                                          complete: 0,
                                          peer_count: 0};
  }

  var peer = torrent.peers[peerInfo.id];

  if (event == 'stopped') {

      if (peer != null){
          delete torrent.peers[peerInfo.id];
          if (metricsInfo.left == 0) {
              //user was a seeder
              if (torrent.complete > 0) {
                  torrent.complete--;
              }
          }

          if ( torrent.peer_count > 0 && torrent.peer_count > torrent.complete ) {
              torrent.peer_count--;
          }
      }

  } else {
      //start and updates
      if (event == 'completed') {
          torrent.downloaded++;
          torrent.complete++;
      }
      if (metricsInfo.left == 0 && peer == null) {
          //new seeder. this will cover 2 cases:
          //started + left = 0
          //update ( due to tracker reset ) + left = 0
          torrent.complete++;
      }
    if (peer == null) {
      peer = torrent.peers[peerInfo.id] = { metrics: {} };
      torrent.peer_count++;
    }
    peer.ip = peerInfo.ip;
    peer.port = peerInfo.port;
    peer.metrics = { uploaded: metricsInfo.uploaded, downloaded: metricsInfo.downloaded, left: metricsInfo.left };
  }

  // TODO: remove outdated peers and torrents without peers
};
