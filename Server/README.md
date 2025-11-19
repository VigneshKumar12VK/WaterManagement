# Water Bottle Sales Management System API

## Overview
This Node.js backend provides RESTful endpoints for managing users, products, orders, payments, invoices, and lookup tables for a water bottle distribution business.

## Main Endpoints

### Lookup Tables
- `GET /api/roles` — List user roles
- `GET /api/payment-methods` — List payment methods
- `GET /api/order-status` — List order statuses

### Users
- `GET /api/users` — List users
- `POST /api/users` — Add user

### Products
- `GET /api/products` — List products
- `POST /api/products` — Add product
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product

### Orders
- `GET /api/orders` — List orders
- `POST /api/orders` — Place order (with items)

### Dashboard
- `GET /api/dashboard` — Get sales, revenue, pending orders, low stock

## Data Model
- See `requirement.md` for SQL table definitions and relationships.

## Usage
1. Start the server: `node index.js`
2. Use tools like Postman to interact with the API endpoints.
3. Update `.env` with your SQL Server database name.

## Next Steps
- Expand endpoints for payments, invoices, and reporting.
- Implement authentication and role-based access control.
- Add error handling and validation.

---
For more details, refer to the requirements and wireframes in the project folder.
