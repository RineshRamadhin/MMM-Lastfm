"use strict"

const Log = require("logger");

const BASE_URL = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=USERNAME&api_key=API_KEY&limit=1&format=json";

/**
 * Last.fm fetcher object.
 * 
 * This object is responsible for data retrieval 
 * from Last.fm, call intervals and broadcasts downstream.
 */
module.exports = class Fetcher {
    #passiveCounter = 0;
    #listener_ids = [];
    #active = true;
    #scheduleId;
    /**
     * 
     * @param {string} notification message type
     * @param {object} payload message data
     */
    #callback = (notification, payload) => {};

    #apiKey;
    #username;
    #activeInterval;
    #passiveInterval;
    #passiveCount;

    /**
     * Create a new Fetcher object.
     * 
     * @param {object} config module config parameters
     * @param {fn} callback method to broadcast messages
     */
    constructor(config, callback) {
        this.#apiKey = config.apiKey;
        this.#username = config.username;
        this.#activeInterval = config.activeInterval;
        this.#passiveInterval = config.passiveInterval;
        this.#passiveCount = config.passiveCount;

        this.#callback = callback;

        this.#schedule();
    }

    /**
     * Check if the fetcher is compatible with given module config.
     * 
     * @param {object} config module config parameters
     * @returns boolean
     */
    isListenerCompatible(config) {
        return (
        this.#apiKey === config.apiKey && 
        this.#username === config.username &&
        this.#activeInterval === config.activeInterval &&
        this.#passiveInterval === config.passiveInterval &&
        this.#passiveCount === config.passiveCount);
    }

    /**
     * Register a module with the fetcher.
     * 
     * @param {string} listener_id module identifier
     */
    addListener(listener_id) {
        if (this.#listener_ids.includes(listener_id)) return;

        Log.info(`[FETCHER][${this.#listener_ids}] Adding listener ${listener_id}.`);
        this.#listener_ids.push(listener_id);
    }

    /**
     * Retrieve data from Last.fm
     */
    #get() {
        Log.info(`[FETCHER][${this.#listener_ids}] Retrieving Last.fm data.`);

        fetch(BASE_URL.replace("API_KEY", this.#apiKey).replace("USERNAME", this.#username), {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then((data) => this.#status(data))
        .then((data) => this.#broadcast(data));
    }

    /**
     * Parse data and update active state.
     * 
     * @param {object} data last.fm data
     * @returns object
     */
    #status(data) {
        if (data.recenttracks.track.length <= 0 ||
            !("@attr" in data.recenttracks.track[0]) ||
            !("nowplaying" in data.recenttracks.track[0]["@attr"]) ||
            !data.recenttracks.track[0]["@attr"]["nowplaying"]) {
                this.#passiveCounter >= this.#passiveCount ? this.#setActive(false) : this.#passiveCounter++;
                return {};
        }

        this.#passiveCounter = 0;
        this.#setActive(true);
        return data;
    }

    /**
     * Broadcast data to each module.
     * 
     * @param {object} data Last.fm data
     */
    #broadcast(data) {
        this.#listener_ids.forEach(id => this.#callback("UPDATE", {
            identifier: id,
            data,
        }));
    }

    /**
     * Set the active state and reschedule the scheduler.
     * 
     * @param {boolean} active the active state
     */
    #setActive(active) {
        if (this.#active === active) return;

        Log.info(`[FETCHER][${this.#listener_ids}] Switching active to ${active}.`);
        this.#unschedule();
        this.#active = active;
        this.#schedule();
    }

    /**
     * Create a new scheduler.
     */
    #schedule() {
        this.#scheduleId = setInterval(
            () => this.#get(),
            this.#active ? this.#activeInterval * 1000 : this.#passiveInterval * 1000
        );
        this.#get();
    }

    /**
     * Remove the scheduler.
     */
    #unschedule() {
        if (this.#scheduleId) clearInterval(this.#scheduleId);
        this.#scheduleId = undefined;
    }
}
