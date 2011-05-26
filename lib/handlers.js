var utils = require('./utils.js');
var formatters = require('./formatters.js');

var scrape = exports.scrape = function(ctx) {
    console.log("Scrape", JSON.stringify(ctx.url));
    var infoHash = ctx.params['info_hash'];
    var pool = announce.pool;
    var torrentInfo = pool.getInfo(infoHash);

    console.log("TorrentInfo:", JSON.stringify(torrentInfo));

    var responseText = formatters.scrape(infoHash,torrentInfo);
    ctx.response.writeHead(200, { 'Content-Type': 'text/plain' });
    ctx.response.end(responseText, 'ascii');
};
    

var scrape_js = exports.scrape_js = function(ctx) {
    console.log("ScrapeJS", JSON.stringify(ctx.url));
    var infoHash = ctx.params['info_hash'];
    var pool = announce.pool;
    var torrentInfo = pool.getInfo(infoHash);

    console.log("TorrentInfo:", JSON.stringify(torrentInfo));

    var response = {
        complete:   torrentInfo.complete,
        incomplete: torrentInfo.incomplete,
        downloaded: torrentInfo.downloaded
    };

    var responseText = JSON.stringify(response);
    ctx.response.writeHead(200, { 'Content-Type': 'text/plain' });
    ctx.response.end(responseText, 'ascii');
};
    

var announce = exports.announce = function(ctx) {
  console.log("Announce", JSON.stringify(ctx.url));

  var infoHash = ctx.params['info_hash'];
  var peer = {
    id: ctx.params['peer_id'],
    ip: ctx.params['ip'] || ctx.request.connection.remoteAddress,
    port: parseInt(ctx.params['port'], 10)
  };
  var metrics = {
    uploaded: parseInt(ctx.params['uploaded'], 10),
    downloaded: parseInt(ctx.params['downloaded'], 10),
    left: parseInt(ctx.params['left'], 10)
  };
  var event = ctx.params['event'] || '';
  var wants = parseInt(ctx.params['numwant'] || 50, 10);
  var compact = parseInt(ctx.params['compact'], 10) || false;

  var pool = announce.pool;
  console.log("Pool:", JSON.stringify(pool));

  pool.update(infoHash, peer, metrics, event);
  var torrentInfo = pool.getInfo(infoHash);
  var wantedPeers = pool.getPeers(infoHash, peer, wants);
  
  console.log("TorrentInfo:", JSON.stringify(torrentInfo));
  console.log("WantedPeers:", JSON.stringify(wantedPeers));

  var responseText = formatters.announce(torrentInfo, wantedPeers, compact);

  ctx.response.writeHead(200, { 'Content-Type': 'text/plain' });
  ctx.response.end(responseText, 'ascii');
};

// default stubbed pool implementation
announce.pool = {
  update: utils.noop,
  getInfo: function() { return { complete: 0, incomplete: 0 }; },
  getPeers: function() { return []; }
};
