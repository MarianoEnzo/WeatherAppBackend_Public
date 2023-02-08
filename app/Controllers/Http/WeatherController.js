"use strict";

const axios = use("axios");
const Env = use("Env");
const { translateToCordenates, get5daysOnly } = use(
  "App/helpers/WeatherHelper"
);

class WeatherController {
  async getTemperatureByCity({ request, response }) {
    try {
      let coordenates = await translateToCordenates(request.params.cityName);
      if (coordenates) {
        const htppData = await axios.request({
          method: "GET",
          url: `https://api.openweathermap.org/data/2.5/weather?lat=${
            coordenates.lat
          }&lon=${coordenates.lng}&lang=${
            request.params.lang
          }&units=metric&appid=${Env.get("WEATHER_KEY")}`,
        });

        let weather = await htppData.data;

        return response.status(200).json({ weather });
      }
      return response.status(204).json();
    } catch (error) {
      console.log(error);
      return response.status(500);
    }
  }

  async getForecast5daysByPlace({ params, response }) {
    try {
      let coordenates = await translateToCordenates(params.place);

      if (coordenates) {
        const httpData = await axios.request({
          method: "GET",
          url: `https://api.openweathermap.org/data/2.5/forecast?lat=${coordenates.lat}&lon=${coordenates.lng}&units=metric&lang=${params.lang}&appid=c82ae0d7abcd446bef15a73df554381f`,
        });
        if(params.lang=="es"){
          const forecast = get5daysOnly(httpData.data.list,"es-ES");
          return response.status(200).json({ ok: true, forecast: forecast });
        }else{
          const forecast = get5daysOnly(httpData.data.list,"en-US");
          return response.status(200).json({ ok: true, forecast: forecast });
        }
        

       
      }
    } catch (error) {
      console.log(error);
      return response.status(500);
    }
  }

  async getForecast5daysWithChords({ params, response }) {
    try {
      //Get the data from the api
      const httpData = await axios.request({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?lat=${params.lat}&lon=${params.long}&units=metric&lang=${params.lang}&appid=c82ae0d7abcd446bef15a73df554381f`,
      });

      //Filter to obtain one forecast for day
      let forecastByDay = get5daysOnly(httpData.data);
      return response.status(200).json({ ok: true, data: forecastByDay });
    } catch (error) {
      console.log(error);
      return response.status(500);
    }
  }

  async getHourlyForecast({ params, response }) {
    try {
      let coordenates = await translateToCordenates(params.place);
      let timeString;
      let dayString;
      if (coordenates) {
        const httpData = await axios.request({
          method: "GET",
          url: `https://api.openweathermap.org/data/2.5/forecast?lat=${coordenates.lat}&lon=${coordenates.lng}&units=metric&lang=${params.lang}&appid=c82ae0d7abcd446bef15a73df554381f`,
        });
        const forecast = httpData.data.list;

        const groupedArray = forecast.reduce((acc, obj) => {
          const date = new Date(obj.dt_txt);

          if (params.lang == "es") {
            dayString = date.toLocaleDateString("es-ES", {
              weekday: "long",
            });

            timeString = date.toLocaleTimeString("es-ES", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            });
          } else {
            dayString = date.toLocaleDateString("en-US", {
              weekday: "long",
            });

            timeString = date.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            });
          }

          obj.day = dayString;
          obj.hour = timeString;

          if (!acc[dayString]) {
            acc[dayString] = {
              day: dayString,
              forecast: [],
            };
          }

          acc[dayString].forecast.push(obj);

          return acc;
        }, {});
        const result = Object.values(groupedArray);
        if (result.length > 5) {
          result.splice(0, 1);
        }

        response.json({ forecast: result });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = WeatherController;
