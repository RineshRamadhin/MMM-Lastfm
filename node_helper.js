"use strict"

const NodeHelper = require("node_helper");
const Log = require("logger");
const Fetcher = require("./fetcher.js");

module.exports = NodeHelper.create({
    fetchers: [],

    socketNotificationReceived: function(notification, payload) {
        if (notification !== "SUBSCRIBE") return;

        let fetcher = this.findFetcher(payload.config)

        if (!fetcher) {
            fetcher = this.createFetcher(payload.identifier, payload.config);
        }

        Log.info(`[${this.name}][${payload.identifier}] Subscribing to fetcher.`);
        fetcher.addListener(payload.identifier);
    },

    findFetcher(config) {
        return this.fetchers.find(f =>f.isListenerCompatible(config));
    },

    createFetcher(identifier, config) {
        Log.info(`[${this.name}][${identifier}] Creating new fetcher.`);
        let fetcher = new Fetcher(config, (n, p) => this.sendSocketNotification(n, p))
        this.fetchers.push(fetcher)

        return fetcher;
    },
});
