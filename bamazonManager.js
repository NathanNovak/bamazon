var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var color = require("colors");

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
		]).then(function(){
			
		})
	});
}
