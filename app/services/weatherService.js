const weatherClient = require('../clients/weatherApiClient');
const cache = require('../cache/weather-cache');

async function getWeather(city, frequency = 'hourly') {
  const cached = cache.get(city, frequency);
  if (cached) return cached;

  const result = await weatherClient.fetchWeather(city);
  cache.set(city, frequency, result);
  return result;
}

module.exports = { getWeather };
