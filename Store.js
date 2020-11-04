const mongoose = require('mongoose');
const storeSchema = mongoose.Schema({
    storeItem: String,
    quantity: Number
})

const storeModel = mongoose.model('store', storeSchema);

module.exports = storeModel;