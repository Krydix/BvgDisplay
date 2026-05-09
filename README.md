# BVG Display

> **Forked from [fsr4/babsi](https://github.com/fsr4/babsi)** — all credit for the original departure board concept goes there.

**Live: [krydix.github.io/BvgDisplay/search.html](https://krydix.github.io/BvgDisplay/search.html)**

Shows departure information for any stop on the BVG/VBB network, hosted as a static site on GitHub Pages.

## Changes in this fork

- Stop ID is no longer hard-coded — it is read from the URL parameter `?stop=<id>` (e.g. `index.html?stop=900181503`)
- Added a **search page** (`search.html`) that queries the BVG API and lists matching stops with links to their departure board
- Page title updates dynamically with the stop name
- Full icon set for all transport modes: S-Bahn, U-Bahn, Tram, Bus, Fähre, Regionalverkehr, Fernverkehr

## Usage

Open `search.html`, type a stop name, and click a result to open its live departure board.  
You can also deep-link directly: `index.html?stop=<stopId>`

## Data sources

- [v6.bvg.transport.rest](https://v6.bvg.transport.rest) — departures & stop search
- [api.sunrise-sunset.org](https://api.sunrise-sunset.org) — sunrise/sunset times for automatic dark mode
