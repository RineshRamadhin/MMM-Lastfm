"use strict"

const ANIMATION_SPEED = 1000;

Module.register("MMM-Lastfm",{
	defaults: {
        apiKey: "",
        username: "",
        activeInterval: 10,
        passiveInterval: 60,
        passiveCount: 5,
	},

    validate() {
        Log.info(`[${this.name}][${this.identifier}] Validating config.`);
        // TODO
    },

    start() {
        Log.info(`[${this.name}][${this.identifier}] Starting module.`);
        this.subscribe();
    },

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = "this.config.text";
		return wrapper;
	},

    getStyles: function() {
        return [
            this.file("css/default.css"),
        ]
    },
    
    socketNotificationReceived: function(notification, payload) {
        if (notification !== "UPDATE") return;
        if (payload.identifier !== this.identifier) return;

        Log.info(`[${this.name}][${this.identifier}] received: ${JSON.stringify(payload)}.`);
    },

    subscribe() {
        Log.info(`[${this.name}][${this.identifier}] Send subscribe socket notification.`);
        this.sendSocketNotification("SUBSCRIBE", {
            identifier: this.identifier,
            config: this.config
        });
    },
});
