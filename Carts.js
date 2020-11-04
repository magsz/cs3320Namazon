const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    cartItem: String,
    quantity: Number
})

const cartModel = mongoose.model('cart', cartSchema);

module.exports = cartModel;