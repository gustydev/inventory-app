const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const db = require('../db/queries');

exports.list = asyncHandler(async function(req, res, next) {
    const categories = await db.selectAll('category');

    res.render('category_list', {
        title: 'Categories',
        categories: categories
    })
})

exports.detail = asyncHandler(async function(req,res,next) {
    const category = await db.selectById('category', req.params.id);
    const itemsWithCategory = await db.getItemsWithCategory(req.params.id);
    console.log(category)
    res.render('category_detail', {
        title: 'Category',
        category: category[0],
        items: itemsWithCategory
    })
})

exports.createGet = asyncHandler(async function(req,res,next) {
    res.render('category_form', {
        title: 'Create category'
    })
})

exports.createPost = [
    body('name', 'Category name is missing').trim().isLength({min: 1}).escape(),
    body('description', 'Description has max length of 100 characters').isLength({max: 100}).trim().escape(),

    asyncHandler(async function(req, res, next) {
        const errors = validationResult(req)
        const category = {
            name: req.body.name, 
            description: req.body.description
        }

        if (errors.isEmpty()) {
            const newCategory = await db.createCategory(...Object.values(category));
            res.redirect(newCategory[0].url);
        } else {
            res.render('category_form', {
                title: 'Create category',
                category: category,
                errors: errors.array()
            })
        }
    })
]

exports.updateGet = asyncHandler(async function(req,res,next) {
    const category = await db.selectById('category', req.params.id);

    res.render('category_form', {
        title: `Update category: ${category[0].name}`,
        category: category[0]
    })
})

exports.updatePost = [
    body('name', 'Category name is missing').trim().isLength({min: 1}).escape(),
    body('description', 'Description has max length of 100 characters').isLength({max: 100}).trim().escape(),
    body('password', 'Incorrect password').equals(process.env.SUPERSECRET).trim().escape(),

    asyncHandler(async function(req, res, next) {
        const errors = validationResult(req)
        const category = {
            name: req.body.name,
            description: req.body.description,
            id: req.params.id
        }

        if (errors.isEmpty()) {
            const updated = await db.updateCategory(...Object.values(category));
            res.redirect(updated[0].url);
        } else {
            res.render('category_form', {
                title: `Update category: ${category.name}`,
                category: category,
                errors: errors.array()
            })
        }
    })
]

exports.deleteGet = asyncHandler(async function(req,res,next) {
    const category = await db.selectById('category', req.params.id)
    const itemsWithCategory = await db.getItemsWithCategory(req.params.id);
    const itemCount = await db.countItemsWithCategory(req.params.id);

    res.render('category_delete', {
        title: `Delete category: ${category[0].name}`,
        category: category[0],
        items: itemsWithCategory,
        count: itemCount[0].count
    })
})

exports.deletePost = [
    body('password', 'Incorrect password').equals(process.env.SUPERSECRET).trim().escape(),

    asyncHandler(async function(req, res, next) {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            await db.deleteById('category', req.params.id)
            res.redirect('/inventory/categories');
        } else {
            const category = await db.selectById('category', req.params.id)
            const itemsWithCategory = await db.getItemsWithCategory(req.params.id);
            const itemCount = await db.countItemsWithCategory(req.params.id);
        
            res.render('category_delete', {
                title: `Delete category: ${category.name}`,
                category: category[0],
                items: itemsWithCategory,
                count: itemCount
            })
        }
    })
]
