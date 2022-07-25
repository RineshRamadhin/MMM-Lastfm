"use strict"

/**
 * Core module component.
 * 
 * This module is responsible for the module DOM objects and
 * default core module functionality. It additionally communicates
 * with the node helper via socket messages.
 */
Module.register("MMM-Lastfm", {
    payload: null,

    /**
     * Default properties for the module. Empty values must be manually set.
     */
    defaults: {
        layout: "default",
        loadingText: "Loading...",
        apiKey: "",
        username: "",
        activeInterval: 10,
        passiveInterval: 60,
        passiveCount: 5,
        animationSpeed: 1000,
        textLength: 30,
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
        if (this.payload === null) return "loading.njk";
        if (Object.keys(this.payload).length === 0) return "empty.njk";

        switch (this.config.layout) {
            case "row":
                return "row.njk";
            case "default":
            default:
                return "standard.njk";
        }
    },

    /**
     * Get the template data.
     * 
     * @returns object
     */
    getTemplateData: function () {
        return {
            config: this.config,
            data: this.data,
            payload: this.payload,
        };
    },

    /**
     * Load style sheets files for the module.
     * 
     * @returns array
     */
    getStyles: function() {
        return [
            this.file("standard.css"),
            this.file("row.css"),
            "font-awesome.css"
        ];
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
        if (JSON.stringify(this.payload) == JSON.stringify(payload.data)) return;
        this.display(!!Object.keys(payload.data).length);

        this.payload = payload.data;
        this.updateDom(this.config.animationSpeed);
    },

    /**
     * Show or hide the module.
     * 
     * @param {boolean} show display module
     */
    display(show) {
        show ? this.show(this.config.animationSpeed) : this.hide(this.config.animationSpeed);
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
