const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register user/dealer
router.post('/register', async (req, res) => {
  const { name, phone, email, roleId, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.query(`INSERT INTO Users (name, phone, email, roleId, passwordHash) VALUES ('${name}', '${phone}', '${email}', ${roleId}, '${passwordHash}')`);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login and get JWT token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query(`SELECT * FROM Users WHERE email='${email}'`);
    const user = result.recordset[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, roleId: user.roleId }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to verify JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Logout (client-side: just remove token)
router.post('/logout', (req, res) => {
  // For stateless JWT, logout is handled client-side
  res.json({ message: 'Logged out' });
});

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(`SELECT id, name, phone, email, roleId, createdAt FROM Users WHERE id=${req.user.id}`);
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
