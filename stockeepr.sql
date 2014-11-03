CREATE TABLE inventory
(
    InventoryID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    StockID INT NOT NULL,
    ReportDate DATETIME NOT NULL,
    Description LONGTEXT
);
CREATE TABLE inventorydata
(
    InventoryID INT NOT NULL,
    ProductID INT NOT NULL,
    Value INT NOT NULL
);
CREATE TABLE products
(
    ProductID INT PRIMARY KEY NOT NULL,
    ProductName VARCHAR(255) NOT NULL,
    ProductUnit VARCHAR(32) NOT NULL,
    ProductDescription LONGTEXT
);
CREATE TABLE stocks
(
    StockID INT PRIMARY KEY NOT NULL,
    StockName VARCHAR(255) NOT NULL,
    StockLocation VARCHAR(255) NOT NULL
);
