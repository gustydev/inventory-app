const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Category = require('../models/category');
const Item = require('../models/item');

exports.index = asyncHandler(async function(req, res, next) {
    const [categories, items, categoryCount, itemCount] = await Promise.all([
        Category.find().exec(),
        Item.find().exec(),
        Category.countDocuments({}).exec(),
        Item.countDocuments({}).exec()
    ]);

    let stock = 0;
    items.forEach((item) => {
        stock += item.stock
    })

    res.render('index', {
        title: 'Index',
        categories: categories,
        items: items,
        categoryCount: categoryCount,
        itemCount: itemCount,
        stock: stock
    })
})