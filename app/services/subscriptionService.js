const { Subscription } = require('../models/Subscription');
const path = require('path');
const crypto = require('crypto');
const mailer = require('../clients/mailer');
const repo = require('../repositories/subscriptionRepository');

exports.subscribe = async (req, res, next) => {
    try {
        const { email, city, frequency } = req.body;
        const token = crypto.randomBytes(16).toString('hex');
        const existing = await repo.findByEmail(email);
        if (existing) return res.status(409).json({ error: 'Email already subscribed' });

        await repo.create({ email, city, frequency, token });
        const link = `${process.env.HOST}/api/confirm/${token}`;
        const html = `
            <div style="font-family: sans-serif; padding: 1rem; color: #333;">
                <h2>Confirm Your Weather Subscription</h2>
                <p>Click the button below to confirm your subscription and start receiving weather updates:</p>
                <a href="${link}" style="display:inline-block;margin-top:1rem;padding:0.75rem 1.5rem;background:#222;color:#fff;text-decoration:none;border-radius:8px;">Confirm Subscription</a>
                <p style="margin-top:2rem;color:#888;font-size:0.9rem;">If you didn’t sign up for this, just ignore this message.</p>
            </div>
        `;
        await mailer.sendMail(email, 'Confirm Your Weather Subscription', null, html);
        res.json({ message: 'Subscription successful. Confirmation email sent.' });
    } catch (err) {
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
