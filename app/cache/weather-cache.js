const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 1800 }); // 30 min TTL

function getCacheKey(city, frequency) {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  let key = `${frequency}:${day}-${month}`;
  if (frequency === 'hourly') key += `:${now.getHours()}`;
  return `${key}:${city.toLowerCase()}`;
}

function get(city, frequency) {
  const key = getCacheKey(city, frequency);
  return cache.get(key);
}

function set(city, frequency, data) {
  const key = getCacheKey(city, frequency);
  cache.set(key, data);
}

module.exports = {
  get,
  set,
  getCacheKey,
};
