require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
