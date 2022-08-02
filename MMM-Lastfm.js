"use strict"

/**
 * Core module component.
 * 
 * This module is responsible for the module DOM objects and
 * default core module functionality. It additionally communicates
 * with the node helper via socket messages.
 */
Module.register("MMM-Lastfm", {
    payload: {
        "recenttracks": {
            "track": [
                {
                    "artist": {
                        "mbid": "75be165a-ad83-4d12-bd28-f589a15c479f",
                        "#text": "Major Lazer"
                    },
                    "streamable": "0",
                    "image": [
                        {
                            "size": "small",
                            "#text": "https://lastfm.freetls.fastly.net/i/u/34s/0d9f76dfaf158fc523427f761afda98b.jpg"
                        },
                        {
                            "size": "medium",
                            "#text": "https://lastfm.freetls.fastly.net/i/u/64s/0d9f76dfaf158fc523427f761afda98b.jpg"
                        },
                        {
                            "size": "large",
                            "#text": "https://lastfm.freetls.fastly.net/i/u/174s/0d9f76dfaf158fc523427f761afda98b.jpg"
                        },
                        {
                            "size": "extralarge",
                            "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/0d9f76dfaf158fc523427f761afda98b.jpg"
                        }
                    ],
                    "mbid": "006ebd5d-33ae-3d12-bcc8-5b51365ec5d5",
                    "album": {
                        "mbid": "1eab7d8f-0263-47cc-b6c1-ec70975a2273",
                        "#text": "Major Lazer Essentials"
                    },
                    "name": "Get Free",
                    "@attr": {
                        "nowplaying": "true"
                    },
                    "url": "https://www.last.fm/music/Major+Lazer/_/Get+Free"
                },
                {
                    "artist": {
                        "mbid": "de22adae-f8ac-414f-b653-b0162611bd60",
                        "#text": "Karol G"
                    },
                    "streamable": "0",
                    "image": [
                        {
                            "size": "small",
                            "#text": "https://lastfm.freetls.fastly.net/i/u/34s/3d5064e3ffc2399595cd072efcc33954.jpg"
                        },
                        {
                            "size": "medium",
                            "#text": "https://lastfm.freetls.fastly.net/i/u/64s/3d5064e3ffc2399595cd072efcc33954.jpg"
                        },
                        {
                            "size": "large",
                            "#text": "https://lastfm.freetls.fastly.net/i/u/174s/3d5064e3ffc2399595cd072efcc33954.jpg"
                        },
                        {
                            "size": "extralarge",
                            "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/3d5064e3ffc2399595cd072efcc33954.jpg"
                        }
                    ],
                    "mbid": "8eb7f5d6-5841-4ecf-97c0-ceb6862d2013",
                    "album": {
                        "mbid": "02a34ce0-002b-4182-85a0-10ac708a704c",
                        "#text": "PROVENZA"
                    },
                    "name": "PROVENZA",
                    "url": "https://www.last.fm/music/Karol+G/_/PROVENZA",
                    "date": {
                        "uts": "1659454974",
                        "#text": "02 Aug 2022, 15:42"
                    }
                }
            ],
            "@attr": {
                "user": "artskillcraft",
                "totalPages": "19215",
                "page": "1",
                "perPage": "1",
                "total": "19215"
            }
        }
    },

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
        albumArtEffects: "",
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
        if (this.payload === null) return "layouts/loading.njk";
        if (Object.keys(this.payload).length === 0) return "layouts/empty.njk";

        switch (this.config.layout) {
            case "row":
                return "layouts/row.njk";
            case "default":
            default:
                return "layouts/standard.njk";
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
            this.file("styles/default.css"),
            this.file("styles/standard.css"),
            this.file("styles/row.css"),
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
        // Log.info(`[${this.name}][${this.identifier}] Send subscribe socket notification.`);
        // this.sendSocketNotification("SUBSCRIBE", {
        //     identifier: this.identifier,
        //     config: this.config
        // });
    },
});
