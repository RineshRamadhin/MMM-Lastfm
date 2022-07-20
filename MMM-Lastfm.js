"use strict"

const ANIMATION_SPEED = 1000;

Module.register("MMM-Lastfm",{

	defaults: {
		text: "Hello World!",
        apiKey: "",
        user: "",
        activeInterval: 10,
        passiveInterval: 60,
        passiveCount: 5,
	},

    start() {
        Log.info(`Starting module: ${this.name}, ID: ${this.identifier}`);
        this.subscribe();
    },

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.config.text;
		return wrapper;
	},

    getStyles: function() {
        return [
            this.file('css/default.css'),
        ]
    },
    
    socketNotificationReceived: function(notification, payload) {
        console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
    },

    subscribe() {
        this.sendSocketNotification('SUBSCRIBE', this.config);
    },
    
});
