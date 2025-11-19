const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect().then(() => console.log('Connected!'))
    .catch(err => console.error(err));;

async function query(sqlQuery) {
  await poolConnect;
  const request = pool.request();
  return request.query(sqlQuery);
}

module.exports = { query };
