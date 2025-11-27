const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');

async function createUser({ name, phone, email, roleId, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: { name, phone, email, roleId, passwordHash }
  });
  return user;
}

async function findByEmail(email) {
  return prisma.users.findFirst({ where: { email } });
}

async function findById(id) {
  return prisma.users.findUnique({ where: { id } });
}

module.exports = { createUser, findByEmail, findById };
