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
    res.render('Item create get')
})

exports.createPost = asyncHandler(async function(req,res,next) {
    res.render('Item create post')
})

exports.updateGet = asyncHandler(async function(req,res,next) {
    res.render('Item update get')
})

exports.updatePost = asyncHandler(async function(req,res,next) {
    res.render('Item update post')
})

exports.deleteGet = asyncHandler(async function(req,res,next) {
    res.render('Item delete get')
})

exports.deletePost = asyncHandler(async function(req,res,next) {
    res.render('Item delete post')
})