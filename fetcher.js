"use strict"

const fetch = require("fetch");
const Log = require("logger");

const BASE_URL = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=USERNAME&api_key=API_KEY&limit=1&format=json";

class Fetcher {
    #passiveCounter = 0;
    #listener_ids = [];
    #active = true;
    #scheduleId;
    #callback = (notification, payload) => {};

    #apiKey;
    #username;
    #activeInterval;
    #passiveInterval;
    #passiveCount;

    constructor(config, callback) {
        this.#apiKey = config.apiKey;
        this.#username = config.username;
        this.#activeInterval = config.activeInterval;
        this.#passiveInterval = config.passiveInterval;
        this.#passiveCount = config.passiveCount;

        this.#callback = callback;

        this.#schedule();
    }

    isListenerCompatible(config) {
        return (
        this.#apiKey === config.apiKey && 
        this.#username === config.username &&
        this.#activeInterval === config.activeInterval &&
        this.#passiveInterval === config.passiveInterval &&
        this.#passiveCount === config.passiveCount);
    }

    addListener(listener_id) {
        if (this.#listener_ids.includes(listener_id)) return;

        Log.info(`[FETCHER][${this.#listener_ids}] Adding listener ${listener_id}.`);
        this.#listener_ids.push(listener_id);
    }

    removeListener(listener_id) {
        Log.info(`[FETCHER][${this.#listener_ids}] Removing listener ${listener_id}.`);
        this.#listener_ids = this.#listener_ids.filter(e => e !== listener_id)
    }

    #get() {
        fetch(BASE_URL.replace("API_KEY", this.#apiKey).replace("USERNAME", this.#username), {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then((data) => this.#status(data))
        .then((data) => this.#broadcast(data));
    }

    #status(data) {
        if (data.recenttracks.track.length <= 0 ||
            !("@attr" in data.recenttracks.track[0]) ||
            !("nowplaying" in data.recenttracks.track[0]["@attr"]) ||
            !data.recenttracks.track[0]["@attr"]["nowplaying"]) {
                this.#passiveCounter >= this.#passiveCount ? this.#setActive(false) : this.#passiveCounter++;
                return data;
        }

        this.#passiveCounter = 0;
        this.#setActive(true);
        return data;
    }

    #broadcast(data) {
        this.#listener_ids.forEach(id => this.#callback("UPDATE", {
            identifier: id,
            data,
        }));
    }

    #setActive(active) {
        if (this.#active === active) return;

        Log.info(`[FETCHER][${this.#listener_ids}] Switching active to ${active}.`);
        this.#unschedule();
        this.#active = active;
        this.#schedule();
    }

    #schedule() {
        this.#scheduleId = setInterval(
            () => this.#get(),
            this.#active ? this.#activeInterval * 1000 : this.#passiveInterval * 1000
        );
        this.#get();
    }

    #unschedule() {
        if (this.#scheduleId) clearInterval(this.#scheduleId);
        this.#scheduleId = undefined;
    }
}

module.exports = Fetcher;
