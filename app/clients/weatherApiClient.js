const axios = require('axios');

exports.fetchWeather = async (city) => {
    let res;
    try {
        res = await axios.get('https://api.weatherapi.com/v1/current.json', {
            params: { key: process.env.WEATHER_API_KEY, q: city },
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }

    const data = res.data.current;
    return {
        temperature: data.temp_c,
        humidity: data.humidity,
        description: data.condition.text,
    };
};