/**
 * @license
 * Copyright © 2020 Intuilab
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability,
 * whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.
 *
 * Except as contained in this notice, the name of Intuilab shall not be used in advertising or otherwise to promote the sale,
 * use or other dealings in this Software without prior written authorization from Intuilab.
 */

/**
 * Inheritance on EventEmitter base class
 * @type {EventEmitter}
 */
ShoppingList.prototype = new EventEmitter();        // Here's where the inheritance occurs
ShoppingList.prototype.constructor = ShoppingList;

/**
 * @constructor
 */
function ShoppingList() {

    this.listItems = [];
	this.designModeItems = [];	
	
    this.totalPrice = 0;
    this.totalCount = 0;

    this.emailBodyToSend = "";
	this.emailTemplate = ""; //this will store an e-mail template fetched from a web server
	
	this.ExportedJSON = "";
	
	this.initDesignModeItems();
	
	//initialize template using default Template
	//Timer is necessary to make sure the FileService is available
	var self = this;
    setTimeout(function() {
         self.InitTemplate("email_template.html");
   }, 500);
}

//This method is called to retrieve the e-mail template from IntuiLab web server. 
ShoppingList.prototype.InitTemplate = function(templateFilePath)
{
	if (this.fileService == null)
		this.fileService = intuiface.get('fileService', this);
	
	var self = this;		
	
	//initialize 
	this.fileService.read(templateFilePath, false, {
	'success': function(result)
	{
		self.emailTemplate = result;
		console.log("INIT TEMPLATE SUCCESS");
	
	}, 'error': function (error){
		self.ErrorMessage = error;
		self.emit('ErrorMessageChanged', [self.ErrorMessage]);
		
		console.error("INIT TEMPLATE ERROR: "+error);
	}});
};

ShoppingList.prototype.initDesignModeItems = function()
{
	for	(var i = 1; i <= 5; i++)
	{
		var p = new ListItem();
		p.productId = "Product-"+i;
		p.productName = "Product Name "+i;
		p.productDescription = "Product Description "+i;
		p.productImage = "http://data.intuilab.com/samples/5.2/ShoppingList/product-icon.png";
		p.productPrice = i*9.99;
		p.quantity = i;
		p.totalPrice = i*i*9.99;
		
		this.designModeItems.push(p);		
	}
	
	this.emit('designModeItemsChanged', [this.designModeItems]);
}


ShoppingList.prototype.AddProductInfo = function (productId, productName, productDescription, productImage, productPrice, quantity) {

	var res = _.find(this.listItems, function (ci) {
		return ci.productId == productId;
	});

	if (res) {
	// Product already exists, increment its quantity		
		res.increaseQuantity(quantity);
		this._computeTotalPrice();		
	}
	else {
	//Product isn't in the list yet, create a ListItem with proper information
		var p = new ListItem();
		p.productId = productId;
		p.productName = productName;
		p.productDescription = productDescription;
		p.productImage = productImage;
				
		if (typeof productPrice == "string")
		{
			p.productPrice = productPrice.replace(/[^0-9\.]+/g,"");
			
		}
		else 
		{
			p.productPrice = productPrice;
		}		
		
		p.quantity = quantity;
		p.totalPrice = (p.productPrice * quantity).toString(); //the toStrign is used to avoid issues between commas and dots

		this.listItems.push(p);
		this.emit('listItemsChanged', [this.listItems]);

		this._computeTotalPrice();
	}
};


ShoppingList.prototype._computeTotalPrice = function (productId) {
    var iQuantity = 0;
    var dTotal = 0.0;
    for (var id in this.listItems)
    {
        iQuantity += parseInt(this.listItems[id].quantity);
        dTotal += parseFloat(this.listItems[id].totalPrice);
    }

    this.totalCount = iQuantity;
    this.totalPrice = dTotal.toString(); //the toStrign is used to avoid issues between commas and dots

    this.emit('totalCountChanged', [this.totalCount]);
    this.emit('totalPriceChanged', [this.totalPrice]);
};

ShoppingList.prototype.removeProduct = function (productId)
{
	var res = _.find(this.listItems, function (ci) {
		return ci.productId == productId;
	});
	
	if (res) {
		//remove element from list
		_.remove(this.listItems, function(ci)
		{
			return ci.productId == productId;
		})
		
		this.emit('listItemsChanged', [this.listItems]);

		this._computeTotalPrice();
	}
};

ShoppingList.prototype.incrementProductQuantity = function(productId)
{
	var res = _.find(this.listItems, function (ci) {
		return ci.productId == productId;
	});
	
	if (res) {
		res.incrementQuantity();
		this._computeTotalPrice();
	}
};


ShoppingList.prototype.decrementProductQuantity = function(productId)
{
	var res = _.find(this.listItems, function (ci) {
		return ci.productId == productId;
	});
	
	if (res) {
		res.decrementQuantity();
		this._computeTotalPrice();
	}
};


ShoppingList.prototype.setProductQuantity = function(productId, newQuantity)
{
	var res = _.find(this.listItems, function (ci) {
		return ci.productId == productId;
	});
	
	if (res) {
		res.setQuantity(newQuantity);
		this._computeTotalPrice();
	}
};

ShoppingList.prototype.clearList = function()
{
	this.listItems = [];
    this.totalPrice = "0";
    this.totalCount = 0;
	
	this.emit('listItemsChanged', [this.listItems]);
	this.emit('totalCountChanged', [this.totalCount]);
    this.emit('totalPriceChanged', [this.totalPrice]);
};


ShoppingList.prototype.buildEmailBody = function()
{	
	//case a template is defined
	if (this.emailTemplate.length > 0)
	{
		//Replace placeholders with real content
		var headerText = "Here are the items you selected: ";
		
		//build HTML for each item in the list
		var tableLines =  [];

		for (var i in this.listItems) {
			tableLines.push("<tr><td>"+this.listItems[i].productId+"</td><td>"
			  +this.listItems[i].productName+"</td><td>"
			  +this.listItems[i].quantity+"</td><td>"
			  +"$ " + parseFloat(this.listItems[i].totalPrice).toFixed(2)+"</td></tr>"
			  );
		}

		var tableHTML = tableLines.join("");
		
		var res = this.emailTemplate;
		res = res.replace("{HEADER}", headerText);
		res = res.replace("{TABLE_LINES}", tableHTML);
		res = res.replace("{TOTAL_PRICE}", "$ " + parseFloat(this.totalPrice).toFixed(2));
		this.emailBodyToSend = res.toString();
		this.emit('emailBodyToSendChanged', [this.emailBodyToSend]);
		
	}
	//case no template was found, generate a basic email
	else	
	{
	var html = [];
		html.push(
		  "<div>Here are the products you selected: </div><br/>",
		  "<table width=\"60%\" style=\"border: 1px solid black; border-collapse:collapse;\" border=\"1\" >",
		  "<tr><td>Product ID</td><td>Name</td><td>Quantity</td><td>Total Price per Product</td></tr>"
		  );
		  
		  for (var i in this.listItems)
		  {
			html.push(
			  "<tr><td>"+this.listItems[i].productId+"</td><td>"
			  +this.listItems[i].productName+"</td><td>"
			  +this.listItems[i].quantity+"</td><td>"
			  +"$ " + parseFloat(this.listItems[i].totalPrice).toFixed(2)+"</td></tr>"
			);
		  }
		 
		 
		 html.push(
		  "<tr><td>Total</td><td></td><td></td><td>"+"$ " + parseFloat(this.totalPrice).toFixed(2)+"</td></tr>",
		  "</table>",
		  "<br/><br/>",
		  "<div>Thank you for your order!</div>"
		);
		
		this.emailBodyToSend = html.join("");
		this.emit('emailBodyToSendChanged', [this.emailBodyToSend]);
	}
	
    this.emit('MailBuilt');
	
};

ShoppingList.prototype.buildJSONForExport = function()
{	
	var json = {};
	var list = [];
	for (var i in this.listItems) {
		list.push({
			"ID": this.listItems[i].productId,
			"ProductName": this.listItems[i].productName,
			"Quantity": this.listItems[i].quantity,
			"TotalPrice": parseFloat(this.listItems[i].totalPrice).toFixed(2)
		});		
	}
	json["List"] = list;
	json["TotalPrice"] = parseFloat(this.totalPrice).toFixed(2);
	
	this.ExportedJSON = JSON.stringify(json);
	this.emit('ExportedJSONChanged', [this.ExportedJSON]);
};
