const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {type: String, required: true, min: 1},
    description: {type: String},
    price: {type: Number, required: true, min: 0},
    stock: {type: Number, required: true, min: 0},
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}]
})

ItemSchema.virtual('url').get(function() {
    return `/inventory/item/${this._id}`;
})

module.exports = mongoose.model('Item', ItemSchema);