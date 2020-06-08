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
ListItem.prototype = new EventEmitter();        // Here's where the inheritance occurs
ListItem.prototype.constructor = ListItem;

/**
 * @constructor
 */
function ListItem() {

    this.productId = "";
    this.productName = "";
    this.productImage = "";
    this.productDescription = "";
    this.productPrice = "";

    this.quantity= 0;
    this.totalPrice = "";

}

ListItem.prototype.incrementQuantity = function()
{
    this.quantity += 1;
    this.computePrice();
}


ListItem.prototype.increaseQuantity = function(increment)
{
    this.quantity += increment;
    this.computePrice();
}

ListItem.prototype.setQuantity = function(newQuantity)
{
    this.quantity = newQuantity;
    this.computePrice();
}


ListItem.prototype.decrementQuantity = function()
{
    if (this.quantity > 0) {
        this.quantity -= 1;
        this.computePrice();
    }
}

ListItem.prototype.computePrice = function()
{
    this.totalPrice = (this.quantity * this.productPrice).toString();    //the toStrign is used to avoid issues between commas and dots
}
