const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const weatherController = require('./app/controllers/weatherController');
const subscriptionController = require('./app/controllers/subscriptionController');
// const errorHandler = require('./middleware/errorHandler');
require('./app/jobs/scheduler');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/weather', weatherController);
app.use('/api', subscriptionController);
app.use(express.static(path.join(__dirname, 'public')));
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();