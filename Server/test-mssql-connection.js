const sql = require('mssql');

const config = {
  user: process.env.DB_USER || 'vignesh',
  password: process.env.DB_PASS || 'Test@1234',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'WaterManagement',
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

sql.connect(config)
  .then(pool => pool.request().query('SELECT TOP 1 * FROM Users'))
  .then(result => {
    console.log('Connection successful! Sample user row:', result.recordset[0]);
    sql.close();
  })
  .catch(err => {
    console.error('Connection failed:', err);
    sql.close();
  });