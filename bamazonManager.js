var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var color = require("colors");

var quantity;
var product;

var connection = mysql.createConnection({
	host: "localhost",

	// Your port; if not 3306
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "root",
	database: "bamazon"
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id", connection.threadId, "\n");
	managerChoice();
});

function managerChoice() {

	var query = connection.query("SELECT * FROM products", function (err, res) {
		inquirer.prompt([
			{
				type: "list",
				name: "manager",
				message: "What would you like to do?",
				choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
			}
		]).then(function (choice) {

			switch (choice.manager) {

				case "View Products for Sale":
					productsForSale();
					break;

				case "Add to Inventory":
					addToInventory();
					break;

				case "Add New Product":
					addNewProduct();
					break;

				case "View Low Inventory":
				viewLowInventory();
				break;
			}


		});
	});
}

function addNewProduct(){
	// console.log("Inserting a new product...\n");

	inquirer.prompt([
		// {
		// 	type: "input",
		// 	name: "itemId",
		// 	message: "Enter the Item ID"
		// },
		{
			type: "input",
			name: "name",
			message: "Enter the product name"
		},
		{
			type: "input",
			name: "department",
			message: "Enter the department"
		},
		{
			type: "input",
			name: "price",
			message: "Enter the price"
		},
		{
			type: "input",
			name: "stock",
			message: "Enter beginning stock"
		}
	]).then(function(answer){
		var query = connection.query(
			"INSERT INTO products SET ?",
			{
				// item_id: answer.itemId,
				product_name: answer.name,
				department_name: answer.department,
				price: answer.price,
				stock_quantity: answer.stock
			},
			function(err, res) {

				console.log("Added", answer.stock,"of", answer.name, "to inventory.");
				console.log(res.affectedRows + " product inserted!\n");

				console.log(query.sql);
			});	
			
				managerChoice();
			});

		// logs the actual query being run
		
	}

function addToInventory() {

	//only gets 
	choices = [];
	var query = connection.query("SELECT * FROM products", function (err, res) {
		if (err) throw err;

		// console.log(res);
		for (var i = 0; i < res.length; i++) {
			quantity = res[i].stock_quantity;
			product = res[i].product_name;
			choices.push(res[i].product_name);

			console.log("Stock of", res[i].product_name, ":", res[i].stock_quantity);
		}

		// console.log(res[i].product_name);
		// console.log(res[i].stock_quantity);

		inquirer.prompt([
			{
				name: "choice",
				type: "list",
				message: "Enter the Item ID of the product",
				choices: choices
			},
			{
				name: "add",
				type: "input",
				message: "Enter quantity to add."
			}
		]).then(function (answer) {
			console.log(answer.choice);


			newQuantity = Number(quantity) + Number(answer.add);
			console.log("OLD Quantity", quantity);
			console.log("New input", answer.add);
			console.log(newQuantity);


			// console.log("Quantity", answer.add);
			// console.log("Product", answer.product);
			var query = connection.query(
				"UPDATE products SET ? WHERE ?",
				[
					{
						stock_quantity: newQuantity
					},
					{
						product_name: answer.choice
					}
				], function (err, res) {
					if (err) throw err;

					// var quantity = res.stock_quantity + answer.add;
					// console.log(answer.product, ",", answer.add);

				}
			);
			console.log("Updating", answer.choice, "to", newQuantity, "units.\n\n");
			managerChoice();
		});
	});
}

function productsForSale() {
	var query = connection.query("SELECT * FROM products", function (err, res) {
		if (err) throw err;
		// console.log(res);

		for (var i = 0; i < res.length; i++) {
			var table = new Table({
				head: ['Item ID', 'Product', 'Department', 'Price', 'Quantity']
				, colWidths: [10, 60, 15, 10, 10]
			});

			// table is an Array, so you can `push`, `unshift`, `splice` and friends
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
			);
			console.log(table.toString());
		}

		console.log("Showing products currently for sale\n\n");

		managerChoice();
	});
}

function viewLowInventory(){
	console.log("Viewing Low Inventory\n");
	managerChoice();
}