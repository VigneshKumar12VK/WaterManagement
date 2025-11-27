Water Bottle Sales Management System – Requirements Document
1. Business Overview

A water bottle distribution business selling products in both small-scale (retail) and bulk (dealers/customers). Variants include:

250 ml

500 ml

1 liter

5 liters

15 liters

Main product: Packaged Water Bottles

Business operations include in-store retail (QR payments), delivery orders, dealer bulk orders, invoice generation, and performance reporting.

2. Technology Stack
Frontend

Angular

Backend

Node.js (Express.js recommended)

Database

SQL Server

Payments

UPI QR Code (initial)

Manual verification for successful payment

Invoices

Admin generates and sends invoices (email/SMS/WhatsApp) after successful payment.

3. User Levels & Permissions
1. Admin

Access Level: Full system access

Admin Capabilities:

Manage products and inventory

View detailed sales reports

Handle user & dealer management

Order creation on behalf of customers

Generate and send invoices

Receive notifications for successful payments

Track customer records

Export reports

2. Dealer / Regular User

Access Level: Limited to ordering features

Dealer/User Capabilities:

Browse products

Add to cart

Place orders

COD payments for delivery

Track order status/history

3. In-Store Customer (Optional Future Enhancement)

Provide name/phone/email

Get unique QR for payment

Receive invoice after payment

4. Key Features
A. Admin Portal Features
1. Dashboard

Total sales (today, weekly, monthly)

Total revenue

Pending payments

Low stock alerts

Best-selling variants

Order count

Dealer vs retail comparison

2. Reports

Sales reports

Monthly

Quarterly

Yearly

Filters:

Product-wise

Date range

Dealer vs retail

Export:

CSV

PDF

Analytics:

Peak purchase times

Top customers/dealers

Revenue trends

3. Stock (Inventory) Management

Add new water bottle variants

Update stock levels

Delete discontinued variants

Auto stock reduction when order is confirmed

Low stock alert (threshold configurable)

4. Product Management

Add/edit/delete:

Name

Size (e.g., 250ml, 5L)

Price

SKU

Description (optional)

5. User and Dealer Management

Add/edit/delete User type Dealer / Admin / User

View order history

View pending and completed payments

Create manual orders on behalf of customers

6. Payments & Invoices

Generate UPI QR (unique transaction ID)

Track whether payment is completed

Admin receives notification on payment success

Generate invoice (PDF preferred)

Send invoice via:

Email

SMS

WhatsApp

Log every transaction

7. Order Management

View all orders (filters: pending, completed, canceled)

Change order status:

Pending

Payment Received

Delivered

Canceled

Issue refunds (optional future feature)

COD handling

B. Dealer/User Portal Features
1. Product Browsing

View all water bottle variants

Display price and stock availability

2. Cart Management

Add products with selected quantity

Update quantities

Remove items

Cart summary with total amount

3. Checkout

Delivery address input

COD only (for now)

Order confirmation screen

4. Order Tracking

View all orders with statuses:

Pending

Out for delivery

Delivered

View invoices for past orders

C. In-Store Purchase Workflow (QR Payment)

Customer provides:

Name

Phone

Email (optional)

System creates a unique order reference

System displays UPI QR code for payment

Customer makes payment

Admin receives payment confirmation

Admin generates invoice and sends it automatically

Order is stored in the database with customer details

5. Additional Suggestions (Recommended)
Role-Based Access Control (RBAC)

Easy scalability for future roles (e.g., Sales Manager, Delivery Staff)

Multi-language Support

English + Local languages

Notifications

Email/SMS for:

Order confirmation

Payment received

Invoice sent

Low stock alerts

Automated Invoice Generation

Reduce manual admin workload

Templates stored in backend

Mobile Responsive UI

Most customers/dealers will use mobile

6. User Stories (Ready for Jira/Sprint Planning)
Admin User Stories

Sales Reports

As an admin, I want to view monthly, quarterly, and yearly sales reports so I can analyze business performance.

As an admin, I want to view best-selling products so I can optimize stock.

As an admin, I want to export sales reports in CSV/PDF so I can use them for accounting.

Stock Management

Add new product variant

Update stock

Delete product

Auto-reduce inventory on sale

Pricing

Edit product price anytime

User & Dealer Management

View list of users/dealers

Check order history

Place orders on behalf of customers

Invoice & Payment

Generate invoices

Send invoices to customers

Receive payment notifications

Track customer details for QR payments

Misc

Receive low stock alerts

View pending payments

Dashboard with KPIs

Dealer/User Stories

Product Browsing

View product variants with prices

Cart

Add to cart

Update/remove items

Checkout

Enter address

Choose COD

Place order

Order Tracking

View order history

Check status

In-Store Customer (Future)

Provide contact details to generate a unique QR payment

Receive invoice automatically after payment

7. Overall System Flow
(A) Retail Store QR Flow

Admin/User enters customer details

System generates QR

Customer pays

Payment auto-detects success

Admin generates and sends invoice

(B) Dealer/Online Order Flow

Dealer browses products

Adds items to cart

Checks out with address

Chooses COD

Admin processes delivery

Status updated

Invoice generated