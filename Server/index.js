require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');

let app;
try {
  // Prefer the Prisma-based app when available
  app = require('./src/app');
  console.log('Loaded Prisma-backed app (src/app.js)');
} catch (err) {
  console.warn('Could not load Prisma app (src/app). Falling back to minimal legacy app. Error:', err.message);
  // Minimal fallback Express app to keep the server running while Prisma is being debugged
  app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => res.send('Server running (legacy fallback)'));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  // Basic placeholder routes for auth and api so front-end can be exercised.
  app.post('/auth/login', (req, res) => {
    res.status(501).json({ error: 'Auth/login not available in fallback mode' });
  });

  app.use('/api', (req, res) => {
    res.status(501).json({ error: 'API not available in fallback mode' });
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
