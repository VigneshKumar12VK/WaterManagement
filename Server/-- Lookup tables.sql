-- Lookup tables
CREATE TABLE UserRoles (
    id INT PRIMARY KEY IDENTITY,
    role NVARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE PaymentMethods (
    id INT PRIMARY KEY IDENTITY,
    method NVARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE OrderStatus (
    id INT PRIMARY KEY IDENTITY,
    status NVARCHAR(20) UNIQUE NOT NULL
);

-- Main tables
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY,
    name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20),
    email NVARCHAR(100),
    roleId INT NOT NULL,
    passwordHash NVARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (roleId) REFERENCES UserRoles(id)
);

CREATE TABLE Products (
    id INT PRIMARY KEY IDENTITY,
    name NVARCHAR(100) NOT NULL,
    size NVARCHAR(20),
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    lowStockThreshold INT DEFAULT 0,
    createdAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Orders (
    id INT PRIMARY KEY IDENTITY,
    userId INT NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    address NVARCHAR(255),
    paymentMethodId INT NOT NULL,
    statusId INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (paymentMethodId) REFERENCES PaymentMethods(id),
    FOREIGN KEY (statusId) REFERENCES OrderStatus(id)
);

CREATE TABLE OrderItems (
    id INT PRIMARY KEY IDENTITY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
);

CREATE TABLE Payments (
    id INT PRIMARY KEY IDENTITY,
    orderId INT NOT NULL,
    transactionId NVARCHAR(100),
    status NVARCHAR(20),
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (orderId) REFERENCES Orders(id)
);

CREATE TABLE Invoices (
    id INT PRIMARY KEY IDENTITY,
    orderId INT NOT NULL,
    pdfUrl NVARCHAR(255),
    sentToPhone NVARCHAR(20),
    sentToEmail NVARCHAR(100),
    FOREIGN KEY (orderId) REFERENCES Orders(id)
);

-- Insert lookup values
INSERT INTO UserRoles (role) VALUES ('admin'), ('dealer'), ('user');
INSERT INTO PaymentMethods (method) VALUES ('COD'), ('UPI');
INSERT INTO OrderStatus (status) VALUES ('pending'), ('paid'), ('delivered'), ('canceled');

INSERT INTO Users (name, phone, email, roleId, passwordHash) VALUES
('Vignesh', '1234567890', 'vignesh.kumar@eleviant.com', 1, 'hashed_password_here');


select * from Users;


CREATE LOGIN vignesh WITH PASSWORD = 'Test@1234';
CREATE USER vignesh FOR LOGIN vignesh;
ALTER ROLE db_datareader ADD MEMBER vignesh;
ALTER ROLE db_datawriter ADD MEMBER vignesh;

Use WaterManagement;
ALTER USER vignesh WITH LOGIN = vignesh;

Use WaterManagement;
SELECT name, type_desc FROM sys.database_principals;

INSERT INTO Products (name, size, price, stock, lowStockThreshold) VALUES
('250ml Bottle', '250ml', 8.00, 200, 15),
('500ml Bottle', '500ml', 12.00, 180, 12),
('1L Bottle', '1L', 20.00, 150, 10),
('2L Bottle', '2L', 35.00, 120, 10),
('5L Can', '5L', 75.00, 80, 8),
('10L Can', '10L', 140.00, 60, 5),
('20L Can', '20L', 260.00, 40, 5),

('250ml Multipack (6)', '6×250ml', 40.00, 90, 10),
('500ml Multipack (6)', '6×500ml', 65.00, 70, 10),
('1L Multipack (6)', '6×1L', 115.00, 50, 5),

('Sparkling Water 500ml', '500ml', 15.00, 110, 10),
('Sparkling Water 1L', '1L', 25.00, 100, 10),
('Mineral Water 1L Premium', '1L', 35.00, 75, 6),

('Flavored Water Lemon 500ml', '500ml', 18.00, 130, 12),
('Flavored Water Mint 500ml', '500ml', 18.00, 125, 12),
('Flavored Water Berry 500ml', '500ml', 20.00, 120, 12),

('Alkaline Water 1L', '1L', 45.00, 95, 8),
('Alkaline Water 2L', '2L', 80.00, 70, 6),

('Cold Pressed Water 500ml', '500ml', 22.00, 140, 10),
('Cold Pressed Water 1L', '1L', 38.00, 90, 8);

INSERT INTO Users (name, phone, email, roleId, passwordHash)
VALUES
('Raj', '9876543210', 'raj@email.com', 2, '$2b$10$X3ESQc2jz/xjEEtUVsaLPuNWCotbpsQMl72OEfcvp3R9h50jwlkQ2'),
('Admin', '9999999999', 'admin@email.com', 1, '$2b$10$X3ESQc2jz/xjEEtUVsaLPuNWCotbpsQMl72OEfcvp3R9h50jwlkQ2'),
('Priya', '9123456780', 'priya@email.com', 3, '$2b$10$X3ESQc2jz/xjEEtUVsaLPuNWCotbpsQMl72OEfcvp3R9h50jwlkQ2');

INSERT INTO Orders (userId, totalAmount, address, paymentMethodId, statusId)
VALUES
(1, 2000.00, 'Chennai', 1, 1),   -- Raj - Pending
(1, 3000.00, 'Chennai', 2, 2),   -- Raj - Paid
(2, 1500.00, 'Bangalore', 1, 3), -- Admin - Delivered
(3, 500.00,  'Hyderabad', 2, 2); -- Priya - Paid

INSERT INTO OrderItems (orderId, productId, quantity, price)
VALUES
-- Order 1 (Raj, Pending)
(1, 2, 10, 200.00),

-- Order 2 (Raj, Paid)
(2, 1, 15, 300.00),

-- Order 3 (Admin, Delivered)
(3, 3, 3, 150.00),

-- Order 4 (Priya, Paid)
(4, 1, 2, 40.00);

INSERT INTO Payments (orderId, transactionId, status)
VALUES
(1, NULL, 'pending'),
(2, 'TXN987654', 'paid'),
(3, 'TXN123456', 'paid'),
(4, 'TXN654321', 'paid');

INSERT INTO Invoices (orderId, pdfUrl, sentToPhone, sentToEmail)
VALUES
(1, NULL, NULL, NULL),
(2, 'invoice_2.pdf', '9876543210', 'raj@email.com'),
(3, 'invoice_3.pdf', '9999999999', 'admin@email.com'),
(4, 'invoice_4.pdf', '9123456780', 'priya@email.com');


ALTER TABLE Orders ALTER COLUMN userId INT NULL;