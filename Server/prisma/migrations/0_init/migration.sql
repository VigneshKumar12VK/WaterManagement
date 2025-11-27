BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Invoices] (
    [id] INT NOT NULL IDENTITY(1,1),
    [orderId] INT NOT NULL,
    [pdfUrl] NVARCHAR(255),
    [sentToPhone] NVARCHAR(20),
    [sentToEmail] NVARCHAR(100),
    CONSTRAINT [PK__Invoices__3213E83F7A2809C9] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OrderItems] (
    [id] INT NOT NULL IDENTITY(1,1),
    [orderId] INT NOT NULL,
    [productId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [price] DECIMAL(10,2) NOT NULL,
    CONSTRAINT [PK__OrderIte__3213E83FB2FA893D] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Orders] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [totalAmount] DECIMAL(10,2) NOT NULL,
    [address] NVARCHAR(255),
    [paymentMethodId] INT NOT NULL,
    [statusId] INT NOT NULL,
    [createdAt] DATETIME,
    CONSTRAINT [PK__Orders__3213E83F11692A5E] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OrderStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [status] NVARCHAR(20) NOT NULL,
    CONSTRAINT [PK__OrderSta__3213E83F0CF6F327] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ__OrderSta__A858923C3A726BD1] UNIQUE NONCLUSTERED ([status])
);

-- CreateTable
CREATE TABLE [dbo].[PaymentMethods] (
    [id] INT NOT NULL IDENTITY(1,1),
    [method] NVARCHAR(10) NOT NULL,
    CONSTRAINT [PK__PaymentM__3213E83FECB56CBA] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ__PaymentM__84482CA9D8917D89] UNIQUE NONCLUSTERED ([method])
);

-- CreateTable
CREATE TABLE [dbo].[Payments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [orderId] INT NOT NULL,
    [transactionId] NVARCHAR(100),
    [status] NVARCHAR(20),
    [createdAt] DATETIME,
    CONSTRAINT [PK__Payments__3213E83F1DF8187C] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Products] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [size] NVARCHAR(20),
    [price] DECIMAL(10,2) NOT NULL,
    [stock] INT NOT NULL,
    [lowStockThreshold] INT,
    [createdAt] DATETIME,
    CONSTRAINT [PK__Products__3213E83FFFC5D360] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[UserRoles] (
    [id] INT NOT NULL IDENTITY(1,1),
    [role] NVARCHAR(20) NOT NULL,
    CONSTRAINT [PK__UserRole__3213E83F2D2C33A6] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ__UserRole__863D214830807E23] UNIQUE NONCLUSTERED ([role])
);

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [phone] NVARCHAR(20),
    [email] NVARCHAR(100),
    [roleId] INT NOT NULL,
    [passwordHash] NVARCHAR(255) NOT NULL,
    [createdAt] DATETIME,
    CONSTRAINT [PK__Users__3213E83F34081B45] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Invoices] ADD CONSTRAINT [FK__Invoices__orderI__4222D4EF] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Orders]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItems] ADD CONSTRAINT [FK__OrderItem__order__3A81B327] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Orders]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItems] ADD CONSTRAINT [FK__OrderItem__produ__3B75D760] FOREIGN KEY ([productId]) REFERENCES [dbo].[Products]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [FK__Orders__paymentM__36B12243] FOREIGN KEY ([paymentMethodId]) REFERENCES [dbo].[PaymentMethods]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [FK__Orders__statusId__37A5467C] FOREIGN KEY ([statusId]) REFERENCES [dbo].[OrderStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [FK__Orders__userId__35BCFE0A] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Payments] ADD CONSTRAINT [FK__Payments__orderI__3F466844] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Orders]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [FK__Users__roleId__2E1BDC42] FOREIGN KEY ([roleId]) REFERENCES [dbo].[UserRoles]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

