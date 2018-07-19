DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products(
item_id INT(10) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(30),
price DECIMAL(6,2),
stock_quantity INT, 
PRIMARY KEY(item_id)
); 

SELECT * FROM products;

