const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Item = require('../models/item');
const Category = require('../models/category');

exports.list = asyncHandler(async function(req, res, next) {
    const categories = await Category.find({}).exec();

    res.render('category_list', {
        title: 'List of categories',
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
    res.render('Category create get')
})

exports.createPost = asyncHandler(async function(req,res,next) {
    res.render('Category create post')
})

exports.updateGet = asyncHandler(async function(req,res,next) {
    res.render('Category update get')
})

exports.updatePost = asyncHandler(async function(req,res,next) {
    res.render('Category update post')
})

exports.deleteGet = asyncHandler(async function(req,res,next) {
    res.render('Category delete get')
})

exports.deletePost = asyncHandler(async function(req,res,next) {
    res.render('Category delete post')
})