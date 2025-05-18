const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

router.get('/', async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'City is required' });
    const result = await weatherService.getWeather(city);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
