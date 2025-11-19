✅ REST API Endpoints – Full Specification
1. Auth APIs
Method	Endpoint	Description
POST	/auth/register	Register user/dealer
POST	/auth/login	Login and get JWT token
POST	/auth/logout	Invalidate token
GET	/auth/profile	Get current user profile
2. Product & Inventory Management APIs
Method	Endpoint	Description
GET	/products	Get all products
GET	/products/:id	Get product by ID
POST	/products	Add new product (Admin only)
PUT	/products/:id	Edit product details
DELETE	/products/:id	Delete product
Stock Management
Method	Endpoint	Description
PUT	/products/:id/stock	Update stock quantity
GET	/products/low-stock	List products below stock threshold
3. Cart APIs (Dealer/User)
Method	Endpoint	Description
GET	/cart	Get user's cart
POST	/cart/add	Add item to cart
PUT	/cart/update/:itemId	Update quantity
DELETE	/cart/remove/:itemId	Remove item
DELETE	/cart/clear	Empty cart
4. Order APIs
Customer/Dealer Orders
Method	Endpoint	Description
POST	/orders	Place new order
GET	/orders/my	Get logged-in user's orders
GET	/orders/:id	Get specific order
Admin Order Management
Method	Endpoint	Description
GET	/admin/orders	Get all orders with filters
PUT	/admin/orders/:id/status	Update status (Pending, Paid, Delivered, Canceled)
POST	/admin/orders/manual	Admin places order on behalf of customer
5. Payment & QR APIs
Method	Endpoint	Description
POST	/payments/qr	Generate unique QR for UPI
GET	/payments/status/:transactionId	Check payment status
POST	/payments/confirm	Admin marks payment as completed
6. Invoice APIs
Method	Endpoint	Description
POST	/invoice/generate/:orderId	Generate invoice PDF
GET	/invoice/:orderId	Download/View invoice
POST	/invoice/send/:orderId	Send invoice via email/SMS
7. User & Dealer Management APIs
Method	Endpoint	Description
GET	/admin/users	List all users
GET	/admin/users/:id/orders	Get user’s order history
POST	/admin/users	Add new dealer/user manually
8. Reports & Dashboard APIs
Method	Endpoint	Description
GET	/admin/dashboard	KPIs: total sales, revenue, low stock count
GET	/admin/reports/sales	Sales report (date-range)
GET	/admin/reports/best-selling	Best-selling variants
GET	/admin/reports/export	Export CSV, PDF
9. Notifications APIs
Method	Endpoint	Description
POST	/notifications/email	Send email
POST	/notifications/sms	Send SMS
GET	/notifications/events	Admin event logs (low stock, payments)
10. Settings APIs
Method	Endpoint	Description
GET	/settings	Fetch system settings
PUT	/settings	Update system settings (stock threshold, invoice template, etc.)