const cron = require('node-cron');
const { Subscription } = require('../models/Subscription');
const weatherService = require('../services/weatherService');
const mailer = require('../clients/mailer');

const CRON_HOURLY = '0 * * * *';
const CRON_DAILY = '0 8 * * *';
const CRON_TEST = '* * * * *';

function buildEmailHTML(city, weather, unsubscribeLink) {
  return `
    <div style="font-family: sans-serif; color: #333; padding: 1rem;">
      <h2 style="color: #000;">Weather Update for ${city}</h2>
      <p>🌡 <strong>Temperature:</strong> ${weather.temperature}°C</p>
      <p>💧 <strong>Humidity:</strong> ${weather.humidity}%</p>
      <p>☁️ <strong>Condition:</strong> ${weather.description}</p>
      <hr style="margin: 2rem 0;" />
      <p style="font-size: 0.9rem; color: #666;">
        Don't want these emails anymore? 
        <a href="${unsubscribeLink}" style="color: #555;">Unsubscribe</a>
      </p>
    </div>
  `;
}

async function sendUpdateEmail(sub) {
  const weather = await weatherService.getWeather(sub.city, sub.frequency);
  const html = buildEmailHTML(sub.city, weather, `${process.env.HOST}/api/unsubscribe/${sub.token}`);
  const subject = `Your ${sub.frequency} Weather Update`;

  await mailer.sendMail(sub.email, subject, undefined, html);
}

// cron.schedule(CRON_HOURLY, async () => {
//   const hourlySubs = await Subscription.findAll({ where: { confirmed: true, frequency: 'hourly' } });
//   for (const sub of hourlySubs) await sendUpdateEmail(sub);
// });

// cron.schedule(CRON_DAILY, async () => {
//   const dailySubs = await Subscription.findAll({ where: { confirmed: true, frequency: 'daily' } });
//   for (const sub of dailySubs) await sendUpdateEmail(sub);
// });

cron.schedule(CRON_TEST, async () => {
  const testSubs = await Subscription.findAll({ where: { confirmed: true } });
  for (const sub of testSubs) {
    console.log(`[TEST] Sending test update to ${sub.email}`);
    await sendUpdateEmail(sub);
  }
});
