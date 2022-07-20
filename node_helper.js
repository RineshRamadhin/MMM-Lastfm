"use strict"

const NodeHelper = require("node_helper");
const Log = require("logger");
const Fetcher = require("./fetcher.js");

const BASE_URL = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=[USERNAME]&api_key=[API_KEY]&limit=1&format=json";

module.exports = NodeHelper.create({
    fetchers: [],

    socketNotificationReceived: function(notification, config) {
        if (notification != "SUBSCRIBE") return;

        Log.log(this.name + " received a socket notification: " + JSON.stringify(config));

        let fetcher = this.findFetcher(
            config.key,
            config.username
        )

        if (!fetcher) {
            fetcher = this.createFetcher();
        }

        // fetcher.dispatch();
    },

    findFetcher(key, username) {
        return this.fetchers.find(f =>
            f.key === key &&
            f.username === username
        );
    },

    createFetcher() {
        console.log('creating new fetcher.');
    },
    
});
