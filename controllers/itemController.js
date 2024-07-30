const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const multer = require('multer');
const upload = multer({ dest: './public/images/uploads/'});
const cloudinary = require('cloudinary');
const db = require('../db/queries');

exports.list = asyncHandler(async function(req, res, next) {
    const items = await db.selectAll('item');
    // For now, items in the item list won't show their categories (couldnt figure out how the fuck the sql queries for that work)

    res.render('item_list', {
        title: 'Items',
        items: items
    })
})

exports.detail = asyncHandler(async function(req,res,next) {
    const item = await db.selectById('item', req.params.id);
    const categories = await db.getItemCategories(req.params.id);
    // Showing categories on item detail page is simple so I'll do just this one (for now?)

    res.render('item_detail', {
        title: 'Item',
        item: item[0],
        categories: categories
    })
})

exports.createGet = asyncHandler(async function(req,res,next) {
    const categories = await db.selectAll('category');

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

    // Don't upload image
    upload.none(),

    // Sanitize and validate inputs
    body('name').trim().notEmpty().withMessage('Name must not be empty'),
    body('description', 'Description is invalid').trim(),
    body('price').isLength({min:0}).withMessage('Price must be 0 or greater').isNumeric().withMessage('Price must be numeric'),
    body('stock').isLength({min:0}).withMessage('Stock must be 0 or greater').isNumeric().withMessage('Stock must be numeric'),
    body('category.*'),

    asyncHandler(async function(req,res,next) {
        const errors = validationResult(req);
        const item = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category
        }

        if (errors.isEmpty()) {
            const createdItem = await db.createItem(...Object.values(item));
            res.redirect(createdItem[0].url);
        } else {
            const categories = await db.selectAll('category');
            res.render('item_form', {
                title: 'Create item',
                categories: categories,
                item: item[0],
                errors: errors.array()
            })
        }
    })
]

exports.updateGet = asyncHandler(async function(req,res,next) {
    const categories = await db.selectAll('category');
    const item = await db.selectById('item', req.params.id);
    const itemCategories = await db.getItemCategories(req.params.id);

    categories.forEach((c) => {
        if (itemCategories.find(cat => cat.id === c.id)) {
            c.checked = true;
        }
    })

    res.render('item_form', {
        title: `Update item: ${item[0].name}`,
        item: item[0],
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

    upload.single('image'),

    // Sanitize and validate inputs
    body('name').trim().notEmpty().withMessage('Name must not be empty'),
    body('description', 'Description is invalid').trim(),
    body('price').isLength({min:0}).withMessage('Price must be 0 or greater').isNumeric().withMessage('Price must be numeric'),
    body('stock').isLength({min:0}).withMessage('Stock must be 0 or greater').isNumeric().withMessage('Stock must be numeric'),
    body('category.*'),
    body('password', 'Incorrect password').equals(process.env.SUPERSECRET).trim().escape(),

    asyncHandler(async function(req,res,next) {
        const errors = validationResult(req);  
        const item = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            imgurl: req.body.imgurl,
            id: req.params.id
        }

        if (errors.isEmpty()) {
            if (req.file) {
                await cloudinary.v2.uploader.upload(`./${req.file.path}`)
                .then(async function (image) {
                    console.log('Image uploaded to Cloudinary: ', image)
                    item.imgurl = image.secure_url;
                })
                .catch(error => console.log('Error uploading image: ', error))
            }

            const updated = await db.updateItem(...Object.values(item));
            res.redirect(updated[0].url);
        } else {
            const categories = await db.selectAll('category');
            const checkedCats = typeof req.body.category === 'object' ? req.body.category : [req.body.category];

            categories.forEach((c) => {
                if (checkedCats.find(cat => Number(cat) === c.id)) {
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
    const item = await db.selectById('item', req.params.id)
    const categories = await db.getItemCategories(req.params.id);

    res.render('item_delete', {
        title: `Delete item: ${item[0].name}`,
        item: item[0],
        categories: categories
    })
})

exports.deletePost = [
    body('password', 'Incorrect password').equals(process.env.SUPERSECRET).trim().escape(),

    asyncHandler(async function(req, res, next) {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            await db.deleteById('item', req.params.id);
            res.redirect('/inventory/items')
        } else {
            const item = await db.selectById('item', req.params.id);
            const categories = await db.getItemCategories(req.params.id);

            res.render('item_delete', {
                title: `Delete item: ${item[0].name}`,
                item: item[0],
                categories: categories,
                errors: errors.array()
            })
        }
    })
]