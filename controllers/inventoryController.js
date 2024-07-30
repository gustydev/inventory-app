const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const db = require('../db/queries');

exports.index = asyncHandler(async function(req, res, next) {
    const [categories, items, categoryCount, itemCount] = await Promise.all([
        db.selectAll('category'),
        db.selectAll('item'),
        db.countRows('category'),
        db.countRows('item')
    ]);

    let stock = 0;
    items.forEach((item) => {
        stock += item.stock
    })

    res.render('index', {
        title: 'Home',
        categories: categories,
        items: items,
        categoryCount: categoryCount[0].count,
        itemCount: itemCount[0].count,
        stock: stock
    })
})