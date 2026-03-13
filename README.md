# MMM-Lastfm

![](./assets/banner.gif)

[![CodeQL](https://github.com/RineshRamadhin/MMM-Lastfm/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/RineshRamadhin/MMM-Lastfm/actions/workflows/codeql-analysis.yml)
[![Automated Tests](https://github.com/RineshRamadhin/MMM-Lastfm/actions/workflows/automated-tests.yml/badge.svg)](https://github.com/RineshRamadhin/MMM-Lastfm/actions/workflows/automated-tests.yml)

A module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) that displays the [Last.fm](https://www.last.fm/) scrobble currently playing.

_Shown above is the module with layout: `row`, albumArtEffects: `cd rotate` and textLength: `100`._

## Installation

Just navigate to the `modules` directory of your MagicMirror² installation and clone this repository.

```sh
git clone https://github.com/RineshRamadhin/MMM-Lastfm.git
```

*While the `package.json` file is included in the repository, there are no runtime dependencies to install. After cloning the repository, you can proceed to configure the module as described in the [Configuration](#configuration) section.*

## Update

To update the module, navigate to the `MMM-Lastfm` directory and pull the latest changes.

```sh
git fetch
git pull
```

Also make sure to review the package.json file for any updates to dependencies and run `npm install` if necessary. After updating, make sure to restart your MagicMirror² instance to apply the changes.

## Prerequisites

### Last.fm API key

To access the Last.fm API you'll first need to create an account on [Last.fm](https://www.last.fm/join).
After you logged in you can [create a new API account](https://www.last.fm/api/account/create). Make sure you don't reuse this API account for other purposes due to [rate limitations](#api-rate-limits).
Fill in the required fields (you can leave `Callback URL` and `Application homepage` empty) and hit save.
Then copy the `apiKey` for your config. You can find an overview of API accounts (and their `apiKey`) on [the API accounts page](https://www.last.fm/api/accounts).

## Configuration

**Example:**

```js
{
  module: "MMM-Lastfm",
  position: "top_left",
  header: "Now listening on Last.fm",
  config: {
    apiKey: "LASTFM_API_KEY",
    username: "LASTFM_USERNAME",
  }
},
```

### Configuration Options

| **Option**        | **Type**   | **Default**    | **Description**                                                                                                                                                        |
| ----------------- | ---------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout`          | `string`   | `standard`     | The layout to use. Left/right alignment will happen automatically. Possible options: [`standard`, `row`, `minimal`, `card`]                                            |
| `align`           | `string`   | automatic      | How to align the chosen layout. Default value will dynamically be calculated based on the module position. Possible options: [`left`, `right`]                         |
| `loadingText`     | `string`   | `Loading...`   | The loading text to show while waiting for the first response from Last.fm.                                                                                            |
| `apiKey`          | `string`   | ``             | The Last.fm API key. See the [Last.fm API key](#lastfm-api-key) section for more info.                                                                                 |
| `username`        | `string`   | ``             | The Last.fm username. See the [User-privacy](#user-privacy) section for more info.                                                                                     |
| `activeInterval`  | `integer`  | `10`           | How often to check for updates when listening to a song in seconds. This should be at least 10 seconds.                                                                |
| `passiveInterval` | `integer`  | `60`           | How often to check for updates when not listening to a song in seconds. This should be at least 10 seconds.                                                            |
| `passiveCount`    | `integer`  | `5`            | How many times to stay in `active` mode after you stop listening to songs before switching to `passive` mode.                                                          |
| `animationSpeed`  | `integer`  | `1000`         | The fade effect speed between songs and showing / hiding the module in ms.                                                                                             |
| `textLength`      | `integer`  | `30`           | The maximum text length before cutting off.                                                                                                                            |
| `albumArtEffects` | `string`   | ``             | A space-separated list of effects to apply to the album art. Possible options: [`grayscale`, `darken`, `blur`, `rounded`, `round`, `rotate[-slow/fast/reverse]`, `cd`] |

### API rate limits
Last.fm makes use of a fair use policy when it comes to API rate limits. In order to reduce the API calls made to Last.fm this module will try to combine API calls as much as possible. When two or more instances of the module are shown on a page, or multiple screens are used, behind the scenes a single fetcher will be used to retrieve data from Last.fm. Fetchers will be reused when instances have the following identical config options: `apiKey`, `username`, `activeInterval`, `passiveInterval` and `passiveCount`.

### User privacy
In order to retrieve the Last.fm userdata your/their profile must have recent listening information public. This is required even if your API key and username are from the same account. 
You can check and update this setting on the [Privacy page](https://www.last.fm/settings/privacy). Uncheck the `Hide recent listening information` option and hit save.

## Screenshots

| Template | Left                                  | Right                                 |
|----------|---------------------------------------|---------------------------------------|
| Standard |![](./assets/layout-standard-left.png) |![](./assets/layout-standard-right.png)|
| Row      |![](./assets/layout-row-left.png)      |![](./assets/layout-row-right.png)     |
| Minimal  |![](./assets/layout-minimal-left.png)  |![](./assets/layout-minimal-right.png) |
| Card     |![](./assets/layout-card-left.png)     |![](./assets/layout-card-right.png)    |

| Effect       | Example                                    |
|:------------:|:------------------------------------------:|
| None         |![](./assets/album-art-effect-none.png)     |
| grayscale    |![](./assets/album-art-effect-grayscale.png)|
| darken       |![](./assets/album-art-effect-darken.png)   |
| blur         |![](./assets/album-art-effect-blur.png)     |
| rounded      |![](./assets/album-art-effect-rounded.png)  |
| round        |![](./assets/album-art-effect-round.png)    |
| round rotate |![](./assets/album-art-effect-rotate.gif)   |
| cd           |![](./assets/album-art-effect-cd.png)       |
