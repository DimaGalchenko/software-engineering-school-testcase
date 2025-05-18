const { Subscription } = require('../models/Subscription');
exports.findByEmail = (email) => Subscription.findOne({ where: { email } });
exports.findByToken = (token) => Subscription.findOne({ where: { token } });
exports.create = (data) => Subscription.create(data);
