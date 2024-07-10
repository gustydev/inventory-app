require('dotenv').config();
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Item = require('../models/item');
const Category = require('../models/category');

exports.list = asyncHandler(async function(req, res, next) {
    const categories = await Category.find({}).exec();

    res.render('category_list', {
        title: 'Categories',
        categories: categories
    })
})

exports.detail = asyncHandler(async function(req,res,next) {
    const category = await Category.findById(req.params.id).exec();
    const itemsWithCategory = await Item.find({category: category}).exec();

    res.render('category_detail', {
        title: 'Category',
        category: category,
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
        const category = new Category({
            name: req.body.name,
            description: req.body.description
        });

        if (errors.isEmpty()) {
            const newCategory = await category.save();
            res.redirect(newCategory.url);
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
    const category = await Category.findById(req.params.id).exec();

    res.render('category_form', {
        title: `Update category: ${category.name}`,
        category: category
    })
})

exports.updatePost = [
    body('name', 'Category name is missing').trim().isLength({min: 1}).escape(),
    body('description', 'Description has max length of 100 characters').isLength({max: 100}).trim().escape(),
    body('password', 'Incorrect password').equals(process.env.SUPERSECRET).trim().escape(),

    asyncHandler(async function(req, res, next) {
        const errors = validationResult(req)
        const updatedCategory = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });

        if (errors.isEmpty()) {
            const updated = await Category.findByIdAndUpdate(req.params.id, updatedCategory, {});
            res.redirect(updated.url);
        } else {
            const category = await Category.findById(req.params.id).exec();

            res.render('category_form', {
                title: `Update category: ${category.name}`,
                category: updatedCategory,
                errors: errors.array()
            })
        }
    })
]

exports.deleteGet = asyncHandler(async function(req,res,next) {
    const category = await Category.findById(req.params.id).exec();
    const itemsWithCategory = await Item.find({category: category}).exec();
    const itemCount = await Item.countDocuments({category: category}).exec();

    res.render('category_delete', {
        title: `Delete category: ${category.name}`,
        category: category,
        items: itemsWithCategory,
        count: itemCount
    })
})

exports.deletePost = [
    body('password', 'Incorrect password').equals(process.env.SUPERSECRET).trim().escape(),

    asyncHandler(async function(req, res, next) {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            await Category.findByIdAndDelete(req.params.id).exec();
            res.redirect('/inventory/categories');
        } else {
            const category = await Category.findById(req.params.id).exec();
            const itemsWithCategory = await Item.find({category: category}).exec();
            const itemCount = await Item.countDocuments({category: category}).exec();
    
            res.render('category_delete', {
                title: `Delete category: ${category.name}`,
                category: category,
                items: itemsWithCategory,
                count: itemCount,
                errors: errors.array()
            })
        }
    })
]
