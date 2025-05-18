const { sequelize, Subscription } = require('../models/Subscription');
const path = require('path');
const crypto = require('crypto');
const mailer = require('../clients/mailer');
const repo = require('../repositories/subscriptionRepository');

exports.subscribe = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { email, city, frequency } = req.body;
    const token = crypto.randomBytes(16).toString('hex');

    const existing = await Subscription.findOne({ where: { email }, transaction: t });
    if (existing) {
      await t.rollback();
      return res.status(409).json({ error: 'Email already subscribed' });
    }

    await Subscription.create({ email, city, frequency, token }, { transaction: t });

    const link = `${process.env.HOST}/api/confirm/${token}`;
    const html = `
      <div style="font-family: sans-serif; padding: 1rem; color: #333;">
        <h2>Confirm Your Weather Subscription</h2>
        <p>Click the button below to confirm your subscription:</p>
        <a href="${link}" style="display:inline-block;margin-top:1rem;padding:0.75rem 1.5rem;background:#222;color:#fff;text-decoration:none;border-radius:8px;">Confirm</a>
      </div>
    `;

    await mailer.sendMail(email, 'Confirm Your Weather Subscription', null, html);

    await t.commit();
    res.json({ message: 'Subscription successful. Confirmation email sent.' });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.confirm = async (req, res, next) => {
    try {
        const sub = await repo.findByToken(req.params.token);
        if (!sub) return res.status(404).send('Invalid confirmation token.');
        sub.confirmed = true;
        await sub.save();
        res.sendFile(path.join(__dirname, '../../public/views/confirmed.html'));
    } catch (err) {
        next(err);
    }
};

exports.unsubscribe = async (req, res, next) => {
    try {
        const sub = await repo.findByToken(req.params.token);
        if (!sub) return res.status(404).send('Invalid unsubscribe token.');
        await sub.destroy();
        res.sendFile(path.join(__dirname, '../../public/views/unsubscribed.html'));
    } catch (err) {
        next(err);
    }
};
