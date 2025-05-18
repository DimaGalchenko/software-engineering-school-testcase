const weatherClient = require('../clients/weatherApiClient');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 1800 });
const TTL = {
  hourly: 1800, // 30 mins
  daily: 18000, // 5 hours
};

function getCacheKey(city, frequency) {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  let key = `${frequency}:${day}-${month}`;
  if (frequency === 'hourly') key += `:${now.getHours()}`;
  return `${key}:${city.toLowerCase()}`;
}

async function getWeather(city, frequency = 'hourly') {
  const key = getCacheKey(city, frequency);
  const cached = cache.get(key);
  if (cached) return cached;
  const result = await weatherClient.fetchWeather(city);

  const ttl = TTL[frequency] || TTL.daily;
  cache.set(key, result, ttl);
  return result;
}

module.exports = { getWeather };