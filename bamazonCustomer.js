var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id", connection.threadId, "\n");
  showProducts();
});

// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

function showProducts() {
  var query = connection.query("SELECT * FROM products", function(err, res) {
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
  });
}
// The app should then prompt users with two messages.
// 1) The first should ask them the ID of the product they would like to buy.
// 2) The second message should ask how many units of the product they would like to buy.
