const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/lookups', authenticate, apiController.getLookups);
router.get('/users', authenticate, authorize(['admin']), apiController.usersSummary);
router.post('/users', authenticate, authorize(['admin']), apiController.createUser);
router.put('/users/:id', authenticate, authorize(['admin']), apiController.editUser);
router.delete('/users/:id', authenticate, authorize(['admin']), apiController.removeUser);
router.get('/users/:id/orders', authenticate, authorize(['admin']), apiController.userOrders);

router.get('/products', authenticate, apiController.productsList);
router.post('/products', authenticate, authorize(['admin']), apiController.createProduct);
router.put('/products/:id', authenticate, authorize(['admin']), apiController.editProduct);
router.delete('/products/:id', authenticate, authorize(['admin']), apiController.removeProduct);

router.get('/orders', authenticate, authorize(['admin']), apiController.ordersList);
router.post('/orders', authenticate, apiController.createOrder);

router.get('/dashboard', authenticate, authorize(['admin']), apiController.dashboard);

module.exports = router;
