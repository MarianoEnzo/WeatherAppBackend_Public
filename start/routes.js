"use strict";

const Response = require('@adonisjs/session/src/VowBindings/Response');

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");


Route.get(
  "api/temperature/:cityName/:lang",
  "WeatherController.getTemperatureByCity"
);
Route.get(
  "api/forecast/:place/:lang",
  "WeatherController.getForecast5daysByPlace"
);
Route.get(
  "api/forecast/chords/:lat/:long",
  "WeatherController.getForecast5daysWithChords"
);

Route.get(
  "api/hourlyForecast/:place/:lang",
  "WeatherController.getHourlyForecast"
);
