const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Item = require('../models/item');
const Category = require('../models/category');

exports.list = asyncHandler(async function(req, res, next) {
    res.render('Category list')
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

exports.detail = asyncHandler(async function(req,res,next) {
    res.render('Category detail')
})