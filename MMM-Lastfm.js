"use strict"

/**
 * Core module component.
 * 
 * This module is responsible for the module DOM objects and
 * default core module functionality. It additionally communicates
 * with the node helper via socket messages.
 */
Module.register("MMM-Lastfm",{
    /**
     * Default properties for the module. Empty values must be manually set.
     */
    defaults: {
        apiKey: "",
        username: "",
        activeInterval: 10,
        passiveInterval: 60,
        passiveCount: 5,
    },

    /**
     * Validate the default object parameters.
     */
    validate() {
        Log.info(`[${this.name}][${this.identifier}] Validating config.`);
        // TODO
    },

    /**
     * Register the module with the node helper.
     */
    start() {
        Log.info(`[${this.name}][${this.identifier}] Starting module.`);
        this.subscribe();
    },

    /**
     * Define the module DOM element.
     * 
     * @returns Element
     */
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = "this.config.text";
        return wrapper;
    },

    /**
     * Load Cascading Style Sheets files for the module.
     * 
     * @returns array
     */
    getStyles: function() {
        return [
            this.file("css/default.css"),
        ]
    },
    
    /**
     * Receive and validates messages from the node helper.
     * 
     * @param {string} notification message type
     * @param {object} payload message data 
     */
    socketNotificationReceived: function(notification, payload) {
        if (payload.identifier !== this.identifier) return;

        if (notification === "UPDATE") this.update(payload);
    },

    /**
     * Update the DOM element based on received data.
     *
     * @param {object} payload message data
     */
    update(payload) {
        console.log(payload);
    },

    /**
     * Send a message to the node helper to subscribe the module to a fetcher.
     */
    subscribe() {
        Log.info(`[${this.name}][${this.identifier}] Send subscribe socket notification.`);
        this.sendSocketNotification("SUBSCRIBE", {
            identifier: this.identifier,
            config: this.config
        });
    },
});
