"use strict"

/**
 * Core module component.
 * 
 * This module is responsible for the module DOM objects and
 * default core module functionality. It additionally communicates
 * with the node helper via socket messages.
 */
Module.register("MMM-Lastfm", {
    domData: {},

    /**
     * Default properties for the module. Empty values must be manually set.
     */
    defaults: {
        apiKey: "",
        username: "",
        activeInterval: 10,
        passiveInterval: 60,
        passiveCount: 5,
        animationSpeed: 1000,
    },    

    /**
     * Update the default object parameters within boundaries.
     */
    bound() {
        if (this.config.activeInterval < 10) {
            this.config.activeInterval = 10;
        }

        if (this.config.passiveInterval < 10) {
            this.config.passiveInterval = 10;
        }

        if (this.config.passiveCount < 0) {
            this.config.passiveCount = 0;
        }

        if (this.config.animationSpeed < 0) {
            this.config.animationSpeed = 0;
        }
    },

    /**
     * Register the module with the node helper.
     */
    start() {
        Log.info(`[${this.name}][${this.identifier}] Starting module.`);
        this.bound();
        this.subscribe();
    },

    /**
     * Get the template file.
     * 
     * @returns string
     */
	getTemplate: function () {
        if (Object.keys(this.domData).length === 0) return "empty.njk";		
        return "standard.njk";
	},

    /**
     * Get the template data.
     * 
     * @returns object
     */
	getTemplateData: function () {
		return this.domData;
	},

    /**
     * Load Cascading Style Sheets files for the module.
     * 
     * @returns array
     */
    getStyles: function() {
        return [this.file("css/default.css")];
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
     * @param {object} payload Last.fm data
     */
    update(payload) {
        this.domData = payload.data;
        this.updateDom(this.config.animationSpeed);
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
