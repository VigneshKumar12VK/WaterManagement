const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const apiRoutes = require('./routes/api.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth/v1', authRoutes);
app.use('/api/v1', apiRoutes);

// global error handler
app.use(errorHandler);

module.exports = app;
