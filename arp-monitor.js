var events = require('events'),
    util = require("util"),
    browser = require('iotdb-arp'),
    debug = require('debug')('arp-monitor');

var ArpMonitor = function() {
    this.previous = {};
    events.EventEmitter.call(this);
    this.ping();
};

module.exports = function () {
    return new ArpMonitor();
};
util.inherits(ArpMonitor, events.EventEmitter);

ArpMonitor.prototype.ping = function() {
    var stream = this;
    setIntervalAndExecute(function() {
        debug("Fetching active network nodes");

        var activeClients = {};
        browser.browser({poll: 0}, function(error, results) {
            if (error) {
                console.error(error);
                return;
            }
            if (!results) {
                return;
            }

            activeClients[results.mac] = results.ip;
            debug("Node found [" + results.mac + "]");
        });

        setTimeout(function() {
            var previous = stream.previous;
            var updates = {};

            for(var mac in activeClients) {
                var ip = activeClients[mac];
                updates[mac] = ip; // Clone the new data.
                if (previous.hasOwnProperty(mac)) {
                    // Remove all duplicate clients from previous list
                    // so that it only contains old clients.
                    delete previous[mac];
                } else {
                    debug("New node 'in' [" + mac + "]");
                    stream.emit("in", {mac: mac, ip: ip});
                }
            }

            for (var mac in previous) {
                var ip = previous[mac];
                // After the first loop, previous now only contains old clients
                debug("Old node 'out' [" + mac + "]");
                stream.emit("out", {mac: mac, ip: ip});
            }

            debug("Updating the current node table");
            stream.emit("update", activeClients);
            stream.previous = updates;
            activeClients = {};
        }, 50000);
    }, 60000);
};

function setIntervalAndExecute(fn, t) {
    fn();
    return(setInterval(fn, t));
}