const Order = require("./Order");
const taxRate = 0.13;
const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  ITEM_1: Symbol("item_1"),
  SIZE_1: Symbol("size_1"),
  ITEM_2: Symbol("item_2"),
  SIZE_2: Symbol("size_2"),
  SEASONINGS: Symbol("seasonings"),
  SOUPS: Symbol("soups"),
  BEVERAGES: Symbol("beverages"),
  TYPE: Symbol("1"),
  SAUCE: Symbol("TOMATO"),
  PAYMENT: Symbol("payment"),
});

module.exports = class PastaOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sSize1 = "";
    this.sSize2 = "";
    this.sSeasonings = "";
    this.sSauce = "";
    this.sSoups = "";
    this.sBeverages = "";
    this.sItem1 = "";
    this.sItem2 = "";
    this.allOrder = "";
    this.subTotal = 0;
    this.tax = 0;
    this.total = 0;
  }

  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        this.stateCur = OrderState.TYPE;
        aReturn.push("Welcome to LinW's Pasta shop.");
        aReturn.push("Please type 1 for pasta, 2 for fried chicken");
        break;
      case OrderState.TYPE:
        if (sInput == 1) {
          this.stateCur = OrderState.SIZE_1;
          this.sItem1 = "pasta";
          aReturn.push(
            "what size pasta would you like? b-big($10), m-medium($8), s-small($5)"
          );
        } else {
          this.stateCur = OrderState.SIZE_2;
          this.sItem2 = "fried chicken";
          aReturn.push(
            "what size fried chicken would you like? b-big($7), m-medium($4), s-small($2)"
          );
        }
        break;
      case OrderState.SIZE_1:
        if (sInput.toLowerCase() == "b") {
          this.sSize1 = "big";
          this.subTotal += 10;
          this.stateCur = OrderState.SEASONINGS;
          aReturn.push(
            "what seasonings would you like to add in your pasta? c-cheese, m-mushroom, b-bolognese"
          );
        } else if (sInput.toLowerCase() == "m") {
          this.sSize1 = "medium";
          this.subTotal += 8;
          this.stateCur = OrderState.SEASONINGS;
          aReturn.push(
            "what seasonings would you like to add in your pasta? c-cheese, m-mushroom, b-bolognese"
          );
        } else if (sInput.toLowerCase() == "s") {
          this.sSize1 = "small";
          this.subTotal += 5;
          this.stateCur = OrderState.SEASONINGS;
          aReturn.push(
            "what seasonings would you like to add in your pasta? c-cheese, m-mushroom, b-bolognese"
          );
        } else {
          this.stateCur = OrderState.SIZE_1;
          aReturn.push(
            "please type b-big($10), m-medium($8), s-small($5) to choose the size of pasta"
          );
        }
        break;
      case OrderState.SIZE_2:
        if (sInput.toLowerCase() == "b") {
          this.sSize2 = "big";
          this.subTotal += 7;
          this.stateCur = OrderState.SAUCE;
          aReturn.push(
            "What sauce would you like for your fried chicken? t-tomato, g-garlic, s-spicy"
          );
        } else if (sInput.toLowerCase() == "m") {
          this.sSize2 = "medium";
          this.subTotal += 4;
          this.stateCur = OrderState.SAUCE;
          aReturn.push(
            "What sauce would you like for your fried chicken? t-tomato, g-garlic, s-spicy"
          );
        } else if (sInput.toLowerCase() == "s") {
          this.sSize2 = "small";
          this.subTotal += 2;
          this.stateCur = OrderState.SAUCE;
          aReturn.push(
            "What sauce would you like for your fried chicken? t-tomato, g-garlic, s-spicy"
          );
        } else {
          this.stateCur = OrderState.SIZE_2;
          aReturn.push(
            "please type b-big($7), m-medium($4), s-small($2) to choose the size of fried chicken"
          );
        }
        break;
      case OrderState.SEASONINGS:
        if (
          sInput.toLowerCase() != "c" &&
          sInput.toLowerCase() != "m" &&
          sInput.toLowerCase() != "b"
        ) {
          this.stateCur = OrderState.SEASONINGS;
          aReturn.push(
            "please type c-cheese, m-mushroom, b-bolognese to choose seasonings for your pasta"
          );
        } else {
          this.stateCur = OrderState.SOUPS;
          if (sInput.toLowerCase() == "c") {
            this.sSeasonings = "cheese";
          } else if (sInput.toLowerCase() == "m") {
            this.sSeasonings = "mushroom";
          } else if (sInput.toLowerCase() == "b") {
            this.sSeasonings = "bolognese";
          }
          this.allOrder +=
            this.sSize1 + "  " + this.sItem1 + " with " + this.sSeasonings;
          aReturn.push("Type Y to add daily soup($3) or N if you don't want");
        }
        break;
      case OrderState.SAUCE:
        if (
          sInput.toLowerCase() != "t" &&
          sInput.toLowerCase() != "g" &&
          sInput.toLowerCase() != "s"
        ) {
          this.stateCur = OrderState.SAUCE;
          aReturn.push(
            "What sauce would you like for your fried chicken? t-tomato, g-garlic, s-spicy"
          );
        } else {
          if (sInput.toLowerCase() == "t") {
            this.sSauce = "tomato";
          } else if (sInput.toLowerCase() == "g") {
            this.sSauce = "garlic";
          } else {
            this.sSauce = "spicy";
          }
          this.stateCur = OrderState.BEVERAGES;
          this.allOrder +=
            this.sSize2 + "  " + this.sItem2 + " with " + this.sSauce;
          aReturn.push(
            "Would you like beverages with that?($3)(type c-coke, d-Canada Dry, f-Fanta, 'no' if you don't want)"
          );
        }
        break;
      case OrderState.SOUPS:
        if (sInput.toLowerCase() == "y") {
          this.sSoups = "daily soup";
          this.subTotal += 3;
          this.allOrder += " and " + this.sSoups + ";\n";
          this.stateCur = OrderState.CONTINUE;
          aReturn.push("Please type Y to order more, N to submit your order");
        } else if (sInput.toLowerCase() == "n") {
          this.allOrder += ";\n";
          this.stateCur = OrderState.CONTINUE;
          aReturn.push("Please type Y to order more, N to submit your order");
        } else {
          this.stateCur = OrderState.SOUPS;
          aReturn.push("Type Y to add daily soup($3) or N if you don't want");
        }
        break;
      case OrderState.BEVERAGES:
        if (sInput.toLowerCase() != "no") {
          if (
            sInput.toLowerCase() != "c" &&
            sInput.toLowerCase() != "d" &&
            sInput.toLowerCase() != "f"
          ) {
            this.stateCur = OrderState.BEVERAGES;
            aReturn.push(
              "Would you like beverages with that?($3)(type c-coke, d-Canada Dry, f-Fanta, 'no' if you don't want)"
            );
          } else {
            if (sInput.toLowerCase() == "c") {
              this.sBeverages = "Coke";
            } else if (sInput.toLowerCase() == "d") {
              this.sBeverages = "Canada Dry";
            } else {
              this.sBeverages = "Fanta";
            }
            this.subTotal += 3;
            this.allOrder += " and " + this.sBeverages + ";\n";
          }
        } else {
          this.allOrder += ";\n";
        }
        this.stateCur = OrderState.CONTINUE;
        aReturn.push("Please type Y to order more, N to submit your order");
        break;
      case OrderState.CONTINUE:
        if (sInput.toLowerCase() == "y") {
          this.stateCur = OrderState.TYPE;
          aReturn.push("Please type 1 for pasta, 2 for fried chicken");
        } else {
          this.stateCur = OrderState.PAYMENT;
          this.tax = this.subTotal * taxRate;
          this.total = this.subTotal + this.tax;
          aReturn.push("Thank you for your order of");
          aReturn.push(this.allOrder);
          aReturn.push(
            `The food price :$${this.subTotal.toFixed(
              2
            )}\nThe food tax :$${this.tax.toFixed(
              2
            )}\nThe total price :$${this.total.toFixed(2)}`
          );
          aReturn.push(`Please pay for your order here`);
          aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
        }
        
        break;
      case OrderState.PAYMENT:
        const infor = sInput.purchase_units[0];
        console.log(infor);
        const address =
          infor.shipping.address.address_line_1 +
          ", " +
          infor.shipping.address.admin_area_2 +
          " " +
          infor.shipping.address.admin_area_1 +
          " " +
          infor.shipping.address.postal_code;
        this.isDone(true);
        let d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(
          `Your order will be delivered at ${d.toTimeString()} to ${address}`
        );
        break;
    }
    return aReturn;
  }
  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sTitle != "-1") {
      this.allOrder = sTitle;
    }
    if (sAmount != "-1") {
      this.total = sAmount;
    }
    const sClientID =
      "AWb2RJ7r8EATJ43cTpvOVWtBzkOlWxJMo17HNwXztSpj2RIq7D1YtamrurOk_PdHWyxqmswXOtHbWs05";

    return `
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.allOrder} order of $${this.total}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.total}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>      
      </body>       
      `;
  }
};
