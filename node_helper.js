"use strict"

const NodeHelper = require("node_helper");
const Log = require("logger");

module.exports = NodeHelper.create({
    fetchers: [],

	start: function () {
		Log.log(`Starting module helper: ${this.name}`);
	},

    socketNotificationReceived: function(notification, payload) {
        if (notification != "SUBSCRIBE") return;

        Log.log(this.name + " received a socket notification: " + JSON.stringify(payload));
    },
    
});
