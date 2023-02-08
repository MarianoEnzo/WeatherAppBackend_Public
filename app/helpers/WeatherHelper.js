"use strict";
const datefns = use("date-fns");
const axios = use("axios");
const Env = use("Env");
async function translateToCordenates(location) {
  try {
    const getCoordinates = await axios.request({
      method: "GET",
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${Env.get(
        "GOOGLE_CORDS_KEY"
      )}`,
    });

    if (getCoordinates.status == 200) {
      let cords = await getCoordinates.data.results[0].geometry.location;

      //It returns a number with many decimals, the api for translation only takes with 2
      cords.lat = (Math.round(cords.lat * 100) / 100).toFixed(2);
      cords.lng = (Math.round(cords.lng * 100) / 100).toFixed(2);

      return cords;
    }
    return null;
  } catch (error) {
    return null;
  }
}

function get5daysOnly(forecastData,lang) {
  //forecastData contains 40 entrys, every entry is the forecast every 3 hours,This just filter the array to obtain only 1 forecast per day
  try {
    //dt = dateTime , its in unix
    let dateInSeconds = forecastData[0].dt;

    const oncePerDay = forecastData
      .map((entry) => {
        if (dateInSeconds == entry.dt) {
          //86400 is one day in seconds, so once it gets the forecast for one day it jumps to another day
          const date = new Date(entry.dt * 1000);
          entry.day = date.toLocaleDateString(lang, { weekday: "long" });
          entry.dayNumber = date.toLocaleDateString(lang, {
            day: "numeric",
            month: "numeric",
          });

          dateInSeconds += 86400;

          return entry;
        }
        return null;
      })
      .filter((entry) => {
        return entry != null;
      });
    const lastForecastDay = forecastData[39];
    const date = new Date(lastForecastDay.dt_txt);
    lastForecastDay.day = date.toLocaleDateString(lang, { weekday: "long" });
    lastForecastDay.dayNumber = date.toLocaleDateString(lang, {
      day: "numeric",
      month: "numeric",
    });

    oncePerDay.push(lastForecastDay);
    oncePerDay.splice(0,1)
    return oncePerDay;
  } catch (error) {
    return null;
  }
}

async function getHourlyForecast() {}

module.exports = { translateToCordenates, get5daysOnly };
