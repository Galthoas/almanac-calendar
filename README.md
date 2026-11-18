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
- **Sunrise and sunset:** calculated for the saved region and shown on each day and in the "Today" panel, with day length.
- **Festival tradition:** choose how the eight festivals are dated:
  - *Fixed dates (default):* Ostara March 20, Litha June 21, Mabon September 22, Yule December 21, and the cross-quarters on the 1st of Feb, May and Aug, and Oct 31.
  - *Astronomical quarters:* the solstices and equinoxes are set by the sun's position each year, and the cross-quarters keep their fixed dates.
  - *All solar:* every festival is set by the sun's position, with cross-quarters at 45° steps of solar longitude.
- **Wheel of the Year:** the festivals shown on the calendar and in the "Upcoming" list.
- **Export:** saves the stored region, tradition and forecast as JSON.

## Accuracy notes

- Moon phases use the mean synodic month, so full-moon dates can be off by about a day
  from astronomical almanacs.
- Sunrise and sunset use low-precision NOAA-style formulas, usually within a few minutes.
  They don't account for terrain or local horizon features.
- Solar-based festival dates are usually within a day of the published values.
  Edit the `TRADITIONS` object in `index.html` to change the dates or add a tradition.

## Planned

- Downloadable regional data packs for offline use.
- Print-friendly monthly view.
