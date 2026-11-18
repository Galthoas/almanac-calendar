# Almanac & Pagan Calendar

A single-page calendar that combines a pagan wheel-of-the-year calendar with a
Farmers' Almanac-style view: moon phases, seasonal festivals, and a weather
forecast for a region you choose.

## Running it

Open `index.html` in any modern browser. No build step or server is needed.

## Features

- **Region setup:** name, latitude, longitude and time zone, saved in the browser.
- **Weather:** a 16-day forecast (high/low and rain chance) from
  [Open-Meteo](https://open-meteo.com), which needs no API key. Use "Refresh weather only" to update it.
- **Moon phases:** calculated locally for every day, with traditional full-moon names.
- **Wheel of the Year:** the eight festivals shown on the calendar and in the "Upcoming" list.
- **Export:** saves the stored region and forecast as JSON.

## Accuracy notes

- Moon phases use the mean synodic month, so full-moon dates can be off by about a day
  from astronomical almanacs.
- Festival dates are fixed approximations (for example, Ostara on March 20 and Litha on
  June 21). Solstices and equinoxes can fall a day either side of these. Edit the `WHEEL`
  list in `index.html` to change them or to follow a different tradition.

## Planned

- Sunrise and sunset times for the saved region.
- Downloadable regional data packs for offline use.
- Print-friendly monthly view.
