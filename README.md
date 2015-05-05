arp-monitor
===========

Monitors the ARP table and notifies of changes.
Uses the iotdb-arp package to find the nodes. Heavily inspired by the network-tools package.

Example
=======

```
var arpMonitor = new ArpMonitor();

arpMonitor.on("in", function(node) {
    console.log(node.mac, node.ip);
}

arpMonitor.on("out", function(node) {
    console.log(node.mac, node.ip);
}
```
