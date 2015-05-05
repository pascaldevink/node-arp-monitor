arp-monitor
===========

Monitors the ARP table and notifies of changes.
Uses the [iotdb-arp](https://www.npmjs.com/package/iotdb-arp) package to find the nodes. Heavily inspired by the [network-tools](https://www.npmjs.com/package/network-tools) package.

Example
=======

```js
var arpMonitor = new ArpMonitor();

arpMonitor.on("in", function(node) {
    console.log(node.mac, node.ip);
}

arpMonitor.on("out", function(node) {
    console.log(node.mac, node.ip);
}
```
