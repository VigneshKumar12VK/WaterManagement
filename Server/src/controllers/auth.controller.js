const authService = require('../services/auth.service');
const { signToken } = require('../utils/jwt');

async function register(req, res, next) {
  try {
    const { name, phone, email, roleId, password } = req.body;
    const existing = await authService.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const user = await authService.createUser({ name, phone, email, roleId, password });
    res.status(201).json({ id: user.id, message: 'User created' });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const bcrypt = require('bcryptjs');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: user.id, roleId: user.roleId });
    res.json({ token });
  } catch (err) {
    next(err);
  }
}

async function profile(req, res, next) {
  try {
    const user = await authService.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ id: user.id, name: user.name, email: user.email, roleId: user.roleId });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, profile };
