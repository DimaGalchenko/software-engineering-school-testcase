const express = require('express');
const router = express.Router();
const subService = require('../services/subscriptionService');
const validate = require('../middleware/validateRequest');
const Joi = require('joi');

const subSchema = Joi.object({
  email: Joi.string().email().required(),
  city: Joi.string().required(),
  frequency: Joi.string().valid('hourly', 'daily').required(),
});

router.post('/subscribe', validate(subSchema), subService.subscribe);
router.get('/confirm/:token', subService.confirm);
router.get('/unsubscribe/:token', subService.unsubscribe);

module.exports = router;
