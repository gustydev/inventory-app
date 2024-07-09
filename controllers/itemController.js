const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Category = require('../models/category');
const Item = require('../models/item');

exports.list = asyncHandler(async function(req, res, next) {
    const items = await Item.find().populate('category').exec();

    res.render('item_list', {
        title: 'Items',
        items: items
    })
})

exports.detail = asyncHandler(async function(req,res,next) {
    const item = await Item.findById(req.params.id).populate('category').exec();

    res.render('item_detail', {
        title: 'Item',
        item: item
    })
})

exports.createGet = asyncHandler(async function(req,res,next) {
    const categories = await Category.find({}).exec();

    res.render('item_form', {
        title: 'Create item',
        categories: categories
    })
})

exports.createPost = [
    // Convert category to array
    (req, res, next) => {
        if (!Array.isArray(req.body.category)) {
          req.body.category =
            typeof req.body.category === "undefined" ? [] : [req.body.category];
        }
        next();
    },

    // Sanitize and validate inputs
    body('name', 'Name must not be empty').isLength({min: 1}).trim().escape(),
    body('description', 'Description is invalid').trim().escape(),
    body('price', 'Price is required and must be a positive number').isLength({min:0}).isNumeric().escape(),
    body('stock', 'Stock is required and must be a positive number').isLength({min:0}).isNumeric().escape(),
    body('category.*').escape(),

    asyncHandler(async function(req,res,next) {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category
        });

        if (errors.isEmpty()) {
            await item.save();
            res.redirect(item.url);
        } else {
            const categories = await Category.find({}).exec();
            res.render('item_form', {
                title: 'Create item',
                categories: categories,
                errors: errors.array()
            })
        }
    })
]

exports.updateGet = asyncHandler(async function(req,res,next) {
    const categories = await Category.find({}).exec();
    const item = await Item.findById(req.params.id).exec();

    categories.forEach((c) => {
        if (item.category.includes(c._id)) {
            c.checked = true;
        }
    })

    res.render('item_form', {
        title: `Update item: ${item.name}`,
        item: item,
        categories: categories
    })
})

exports.updatePost = [
    // Convert category to array
    (req, res, next) => {
        if (!Array.isArray(req.body.category)) {
            req.body.category =
                typeof req.body.category === "undefined" ? [] : [req.body.category];
            }
        next();
    },
    
    // Sanitize and validate inputs
    body('name', 'Name must not be empty').isLength({min: 1}).trim().escape(),
    body('description', 'Description is invalid').trim().escape(),
    body('price', 'Price is required and must be a positive number').isLength({min:0}).isNumeric().escape(),
    body('stock', 'Stock is required and must be a positive number').isLength({min:0}).isNumeric().escape(),
    body('category.*').escape(),
    body('password', 'Incorrect password').equals(process.env.SUPERSECRET).trim().escape(),

    asyncHandler(async function(req,res,next) {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            _id: req.params.id
        });

        if (errors.isEmpty()) {
            const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
            res.redirect(updatedItem.url);
        } else {
            const categories = await Category.find({}).exec();
            const item = await Item.findById(req.params.id).exec();
        
            categories.forEach((c) => {
                if (item.category.includes(c._id)) {
                    c.checked = true;
                }
            })
        
            res.render('item_form', {
                title: `Update item: ${item.name}`,
                item: item,
                categories: categories,
                errors: errors.array()
            })
        }
    })
]

exports.deleteGet = asyncHandler(async function(req,res,next) {
    const item = await Item.findById(req.params.id).populate('category').exec();

    res.render('item_delete', {
        title: `Delete item: ${item.name}`,
        item: item
    })
})

exports.deletePost = [
    body('password', 'Incorrect password').equals(process.env.SUPERSECRET).trim().escape(),

    asyncHandler(async function(req, res, next) {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            await Item.findByIdAndDelete(req.params.id);
            res.redirect('/inventory/items')
        } else {
            const item = await Item.findById(req.params.id).populate('category').exec();

            res.render('item_delete', {
                title: `Delete item: ${item.name}`,
                item: item,
                errors: errors.array()
            })
        }
    })
]