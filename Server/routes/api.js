const express = require('express');
const router = express.Router();
const db = require('../db');

// Lookup tables
router.get('/roles', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM UserRoles');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/payment-methods', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM PaymentMethods');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/order-status', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM OrderStatus');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Management
router.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Users');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', async (req, res) => {
  const { name, phone, email, roleId, passwordHash } = req.body;
  try {
    await db.query(`INSERT INTO Users (name, phone, email, roleId, passwordHash) VALUES ('${name}', '${phone}', '${email}', ${roleId}, '${passwordHash}')`);
    res.status(201).json({ message: 'User added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Product Management
router.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Products');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products', async (req, res) => {
  const { name, size, price, stock, lowStockThreshold } = req.body;
  try {
    await db.query(`INSERT INTO Products (name, size, price, stock, lowStockThreshold) VALUES ('${name}', '${size}', ${price}, ${stock}, ${lowStockThreshold || 0})`);
    res.status(201).json({ message: 'Product added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  const { name, size, price, stock, lowStockThreshold } = req.body;
  const { id } = req.params;
  try {
    await db.query(`UPDATE Products SET name='${name}', size='${size}', price=${price}, stock=${stock}, lowStockThreshold=${lowStockThreshold || 0} WHERE id=${id}`);
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM Products WHERE id=${id}`);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order Management
router.get('/orders', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Orders');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orders', async (req, res) => {
  const { userId, items, address, paymentMethodId, statusId, totalAmount } = req.body;
  // items: [{ productId, quantity, price }]
  try {
    const orderResult = await db.query(`INSERT INTO Orders (userId, totalAmount, address, paymentMethodId, statusId) OUTPUT INSERTED.id VALUES (${userId}, ${totalAmount}, '${address}', ${paymentMethodId}, ${statusId})`);
    const orderId = orderResult.recordset[0].id;
    for (const item of items) {
      await db.query(`INSERT INTO OrderItems (orderId, productId, quantity, price) VALUES (${orderId}, ${item.productId}, ${item.quantity}, ${item.price})`);
    }
    res.status(201).json({ message: 'Order placed', orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard Metrics
router.get('/dashboard', async (req, res) => {
  try {
    // Example: total sales today, revenue, pending orders, low stock
    const salesToday = await db.query("SELECT SUM(totalAmount) AS TotalSales FROM Orders WHERE CAST(createdAt AS DATE) = CAST(GETDATE() AS DATE)");
    const revenueMonth = await db.query("SELECT SUM(totalAmount) AS RevenueMonth FROM Orders WHERE MONTH(createdAt) = MONTH(GETDATE())");
    const pendingOrders = await db.query("SELECT COUNT(*) AS PendingOrders FROM Orders WHERE statusId = (SELECT id FROM OrderStatus WHERE status = 'pending')");
    const lowStock = await db.query("SELECT COUNT(*) AS LowStock FROM Products WHERE stock < lowStockThreshold");
    res.json({
      totalSalesToday: salesToday.recordset[0].TotalSales,
      revenueMonth: revenueMonth.recordset[0].RevenueMonth,
      pendingOrders: pendingOrders.recordset[0].PendingOrders,
      lowStock: lowStock.recordset[0].LowStock
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
