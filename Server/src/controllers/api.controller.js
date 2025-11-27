const apiService = require('../services/api.service');

async function getLookups(req, res, next) {
  try {
    const [roles, paymentMethods, orderStatus] = await Promise.all([
      apiService.getRoles(),
      apiService.getPaymentMethods(),
      apiService.getOrderStatus()
    ]);
    res.json({ roles, paymentMethods, orderStatus });
  } catch (err) { next(err); }
}

async function usersSummary(req, res, next) {
  try {
    const data = await apiService.getUsersSummary(req.query);
    res.json(data);
  }
  catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const data = await apiService.addUser(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function editUser(req, res, next) {
  try {
    const data = await apiService.updateUser(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function removeUser(req, res, next) {
  try {
    const data = await apiService.deleteUser(req.params.id);
    res.json({ deleted: true, data });
  } catch (err) { next(err); }
}

async function productsList(req, res, next) {
  try {
    const data = await apiService.getProducts();
    res.json(data);
  } catch (err) { next(err); }
}

async function createProduct(req, res, next) {
  try {
    const data = await apiService.addProduct(req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
}

async function editProduct(req, res, next) {
  try {
    const data = await apiService.updateProduct(req.params.id, req.body);
    res.json(data);
  } catch (err) { next(err); }
}

async function removeProduct(req, res, next) {
  try {
    const data = await apiService.deleteProduct(req.params.id);
    res.json({ deleted: true, data });
  } catch (err) { next(err); }
}

async function ordersList(req, res, next) {
  try {
    const data = await apiService.getOrders();
    res.json(data);
  } catch (err) { next(err); }
}

async function createOrder(req, res, next) {
  try {
    const data = await apiService.createOrder(req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
}

async function dashboard(req, res, next) {
  try {
    const data = await apiService.getDashboard();
    res.json(data);
  } catch (err) { next(err); }
}

module.exports = {
  getLookups,
  usersSummary,
  createUser,
  editUser,
  removeUser,
  productsList,
  createProduct,
  editProduct,
  removeProduct,
  ordersList,
  createOrder,
  dashboard,
  userOrders
};

async function userOrders(req, res, next) {
  try {
    const data = await apiService.getOrdersByUser(req.params.id);
    res.json(data);
  } catch (err) { next(err); }
}
