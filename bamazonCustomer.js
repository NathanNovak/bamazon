var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var color = require("colors");

var chosenProduct;
var custQuantity;

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
    if (err) throw err;
    console.log(res);

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

    choseProduct();
  });
}
// The app should then prompt users with two messages.

function choseProduct(){
  var query = connection.query("SELECT * FROM products", function (err, res) {

  inquirer.prompt([
    {
      name: "ID",
      type: "input",
      message: "What's the item ID of the product you want to buy?"
    }
  ]).then(function (questions) {

    for (var i = 0; i < res.length; i++) {
      // console.log('dfdfdf', res[i].item_id);
      // console.log("QUESTION ID:",  Number(questions.ID));

      if (res[i].item_id === Number(questions.ID)) {

        chosenProduct = res[i].product_name;
        
        console.log("Looks like you selected Item ID#", res[i].item_id, "which is", chosenProduct + "!");
        selectedProduct();
      }
    }
    // showProducts();
  });
});
}

function updateInventory() {
  

  var query = connection.query("UPDATE products SET ? WHERE ?", 
  [
    {
      stock_quantity: custQuantity
    },
    {
      product_name: chosenProduct
    } 
  ],
  function(err, res){
    if (err) throw err;
    console.log("Updating", chosenProduct, "inventory:", custQuantity);
  //  console.log(res);
});
  connection.end();
}

function selectedProduct(questions, res) {

  var query = connection.query("SELECT * FROM products WHERE ?", {product_name: chosenProduct }, function (err, res) {
    // console.log("PRODUCT:", chosenProduct);
    inquirer.prompt([
      {
        name: "confirm",
        type: "confirm",
        message: "Is this correct\n",
        default: true
      }
    ]).then(function (confirm) {
      if (confirm.confirm === true) {
        inquirer.prompt([
          {
            name: "amount",
            type: "input",
            message: "Great! How many do you need?"
          }
        ]).then(function (quantity) {
          // console.log(quantity.amount);
          // console.log(res[0].stock_quantity);
          // for (var i = 0; i < res.length; i++) {

          //check inventory for requested amount 
          if (Number(quantity.amount) <= res[0].stock_quantity){

            console.log("\n===============================================".gray);
            console.log("Looks like we have", res[0].stock_quantity, "left and you said you need", quantity.amount, ",so", quantity.amount, "\nit is!" + "\n \n Your total for the order is".green,"$" + res[0].price * quantity.amount + ".\n".green);
            console.log("================================================\n".gray);


            custQuantity = res[0].stock_quantity - quantity.amount;
            // console.log("QUANTITY AFTER:", custQuantity);
            updateInventory();
          }
          else{
            console.log("--------------------------------");
            console.log("Sorry, looks like we only have", res[0].stock_quantity, "in stock!");
          }
        // }
          // checkInventory(product);
        });
      }
      else {
        console.log("My bad! Let's start again.\n");
        choseProduct();
      }
    });
  });
}
// 1) The first should ask them the ID of the product they would like to buy.
// 2) The second message should ask how many units of the product they would like to buy.
