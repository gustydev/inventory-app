const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Category = require('../models/category');
const Item = require('../models/item');

exports.list = asyncHandler(async function(req, res, next) {
    res.render('Item list')
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

exports.detail = asyncHandler(async function(req,res,next) {
    res.render('Item detail')
})