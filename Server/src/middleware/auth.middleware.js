const { verifyToken } = require('../utils/jwt');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function authorize(roles = []) {
  return (req, res, next) => {
    // roles param can be a single role or array
    if (typeof roles === 'string') {
      roles = [roles];
    }
    // req.user is set by authenticate middleware after JWT verification
    if (!req.user || !roles.includes(getRoleName(req.user.roleId))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Helper to map roleId to role name
function getRoleName(roleId) {
  if (roleId === 1) return 'admin';
  if (roleId === 2) return 'dealer';
  if (roleId === 3) return 'user';
  return null;
}

module.exports = { authenticate, authorize };
