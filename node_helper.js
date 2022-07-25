"use strict"

const NodeHelper = require("node_helper");
const Log = require("logger");
const Fetcher = require("./fetcher.js");

/**
 * Node helper module component.
 * 
 * This module is responsible for managing the creation and reuse 
 * of fetcher objects in order to efficiently retrieve data.
 */
module.exports = NodeHelper.create({
    /**
     * List of fetchers objects currently in use.
     */
    fetchers: [],

    /**
     * Receive and validates messages from the module(s).
     * 
     * @param {string} notification message type
     * @param {object} payload message data 
     */
    socketNotificationReceived: function(notification, payload) {
        if (notification === "SUBSCRIBE") this.subscribe(payload);
    },

    /**
     * Subscribe a module to a (new) fetcher.
     *
     * @param {object} payload message data 
     */
    subscribe(payload) {
        let fetcher = this.findFetcher(payload.config)

        if (!fetcher) {
            fetcher = this.createFetcher(payload.identifier, payload.config);
        }

        Log.info(`[${this.name}][${payload.identifier}] Subscribing to fetcher.`);
        fetcher.addListener(payload.identifier);
    },

    /**
     * Find a fetcher compatible with the module config.
     *
     * @param {object} config module config parameters
     * @returns 
     */
    findFetcher(config) {
        return this.fetchers.find(f => f.isListenerCompatible(config));
    },

    /**
     * Create a new fetcher object for the module config.
     *
     * @param {string} identifier module identifier
     * @param {object} config module config parameters
     * @returns Fetcher
     */
    createFetcher(identifier, config) {
        Log.info(`[${this.name}][${identifier}] Creating new fetcher.`);
        let fetcher = new Fetcher(config, (n, p) => this.sendSocketNotification(n, p))
        this.fetchers.push(fetcher)

        return fetcher;
    },
});
