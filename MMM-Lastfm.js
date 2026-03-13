"use strict";

const DEFAULT_ACTIVE_INTERVAL = 10;
const DEFAULT_PASSIVE_INTERVAL = 60;
const DEFAULT_PASSIVE_COUNT = 5;
const DEFAULT_ANIMATION_SPEED = 1000;
const DEFAULT_TEXT_LENGTH = 30;
const MIN_INTERVAL = 10;

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
        layout: "standard",
        align: null,
        loadingText: "Loading...",
        apiKey: "",
        username: "",
        activeInterval: DEFAULT_ACTIVE_INTERVAL,
        passiveInterval: DEFAULT_PASSIVE_INTERVAL,
        passiveCount: DEFAULT_PASSIVE_COUNT,
        animationSpeed: DEFAULT_ANIMATION_SPEED,
        textLength: DEFAULT_TEXT_LENGTH,
        albumArtEffects: "",
    },

    /**
     * Update the default object parameters within boundaries.
     */
    bound() {
        if (!this.config.align) {
            this.config.align = ['top_right', 'bottom_right'].includes(this.data.position)
            ? 'right'
            : 'left';
        }

        if (this.config.activeInterval < MIN_INTERVAL) {
            this.config.activeInterval = MIN_INTERVAL;
        }

        if (this.config.passiveInterval < MIN_INTERVAL) {
            this.config.passiveInterval = MIN_INTERVAL;
        }

        if (this.config.passiveCount < 0) {
            this.config.passiveCount = 0;
        }

        if (this.config.animationSpeed < 0) {
            this.config.animationSpeed = 0;
        }

        if (this.config.textLength < 0) {
            this.config.textLength = DEFAULT_TEXT_LENGTH;
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
        if (this.payload === null) return "layouts/loading.njk";
        if (Object.keys(this.payload).length === 0) return "layouts/empty.njk";

        switch (this.config.layout) {
            case "row":
                return `layouts/row-${this.config.align}.njk`;
            case "minimal":
                return `layouts/minimal-${this.config.align}.njk`;
            case "standard":
            default:
                return `layouts/standard-${this.config.align}.njk`;
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
            this.file("styles/shared.css"),
            this.file("styles/standard.css"),
            this.file("styles/row.css"),
            this.file("styles/minimal.css"),
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
        if (JSON.stringify(this.payload) === JSON.stringify(payload.data)) return;
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
