require('dotenv/config');
const { PrismaMssql } = require('@prisma/adapter-mssql');
const { PrismaClient } = require('@prisma/client');

const sqlConfig = {
  user: process.env.DB_USER || 'vignesh',
  password: process.env.DB_PASS || 'Test@1234',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'WaterManagement',
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const adapter = new PrismaMssql(sqlConfig);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;