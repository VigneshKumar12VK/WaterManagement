const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
async function getRoles() {
  return prisma.userRoles.findMany();
}

async function getPaymentMethods() {
  return prisma.paymentMethods.findMany();
}

async function getOrderStatus() {
  return prisma.orderStatus.findMany();
}

async function getUsersSummary(filters = {}) {
  const where = {};
  if (filters.name) {
    where.name = { contains: filters.name };
  }
  if (filters.email) {
    where.email = { contains: filters.email };
  }
  if (filters.roleId) {
    where.roleId = Number(filters.roleId);
  }

  const users = await prisma.users.findMany({
    where,
    include: {
      UserRoles: true,
      Orders: { include: { OrderStatus: true } }
    }
  });
  return users.map((u) => {
    const orderCount = u.Orders.length;
    const pendingPayments = u.Orders
      .filter(o => o.statusId && o.OrderStatus?.status === 'pending')
      .reduce((s, o) => s + Number(o.totalAmount || 0), 0);
    const completedPayments = u.Orders
      .filter(o => o.statusId && (o.OrderStatus?.status === 'paid' || o.OrderStatus?.status === 'delivered'))
      .reduce((s, o) => s + Number(o.totalAmount || 0), 0);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      roleName: u.UserRoles?.role || null,
      orderCount,
      pendingPayments,
      completedPayments
    };
  });
}

async function addUser({ name, phone, email, roleId, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.users.create({ data: { name, phone, email, roleId, passwordHash } });
}

async function updateUser(id, { name, phone, email, roleId, password }) {
  const data = { name, phone, email, roleId };
  if (password) {
    const passwordHash = await bcrypt.hash(password, 10);
    data.passwordHash = passwordHash;
  }
  return prisma.users.update({ where: { id: Number(id) }, data });
}

async function deleteUser(id) {
  return prisma.users.delete({ where: { id: Number(id) } });
}

// Products CRUD
async function getProducts() {
  return prisma.products.findMany();
}

async function addProduct({ name, size, price, stock, lowStockThreshold }) {
  return prisma.products.create({ data: { name, size, price, stock, lowStockThreshold } });
}

async function updateProduct(id, { name, size, price, stock, lowStockThreshold }) {
  return prisma.products.update({ where: { id: Number(id) }, data: { name, size, price, stock, lowStockThreshold } });
}

async function deleteProduct(id) {
  return prisma.products.delete({ where: { id: Number(id) } });
}

// Orders
async function getOrders() {
  return prisma.orders.findMany({ include: { OrderItems: true, PaymentMethods: true, OrderStatus: true } });
}

async function createOrder({ userId, items, address, paymentMethodId, statusId, totalAmount }) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.orders.create({ data: { userId, totalAmount, address, paymentMethodId, statusId, createdAt: new Date() } });
    for (const it of items) {
      await tx.orderItems.create({ data: { orderId: order.id, productId: it.productId, quantity: it.quantity, price: it.price } });
    }
    return order;
  });
}

// Dashboard metrics
async function getDashboard() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const nextMonth = new Date(monthStart);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const salesToday = await prisma.orders.aggregate({ _sum: { totalAmount: true }, where: { createdAt: { gte: todayStart, lt: tomorrowStart } } });
  const revenueMonth = await prisma.orders.aggregate({ _sum: { totalAmount: true }, where: { createdAt: { gte: monthStart, lt: nextMonth } } });
  const pendingOrders = await prisma.orders.count({ where: { OrderStatus: { status: 'pending' } } });

  // low stock: products where stock < lowStockThreshold (can't compare fields server-side in Prisma easily)
  const allProducts = await prisma.products.findMany({ select: { stock: true, lowStockThreshold: true } });
  const lowStock = allProducts.filter(p => p.lowStockThreshold !== null && p.stock < p.lowStockThreshold).length;

  return {
    totalSalesToday: Number(salesToday._sum.totalAmount || 0),
    revenueMonth: Number(revenueMonth._sum.totalAmount || 0),
    pendingOrders,
    lowStock
  };
}

async function getOrdersByUser(userId) {
  const orders = await prisma.orders.findMany({
    where: { userId: Number(userId) },
    include: {
      OrderItems: {
        include: {
          Products: true
        }
      },
      PaymentMethods: true,
      OrderStatus: true
    }
  });

  return orders.map(order => ({
    id: order.id,
    totalAmount: order.totalAmount,
    paymentMethod: order.PaymentMethods?.method,
    status: order.OrderStatus?.status,
    createdAt: order.createdAt,
    items: order.OrderItems.map(item => ({
      productName: item.Products?.name,
      quantity: item.quantity,
      price: item.price
    }))
  }));
}
module.exports = {
  getRoles,
  getPaymentMethods,
  getOrderStatus,
  getUsersSummary,
  getUsersSummary,
  addUser,
  updateUser,
  deleteUser,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  createOrder,
  getDashboard,
  getOrdersByUser
};

