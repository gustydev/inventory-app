const express = require("express");
const router = express.Router();

const inventory_controller = require('../controllers/inventoryController');
const category_controller = require('../controllers/categoryController');
const item_controller = require('../controllers/itemController');

// Main inventory route
router.get('/', inventory_controller.index);

// Category routes
router.get('/categories', category_controller.list);

router.get('/category/create', category_controller.createGet)
router.post('/category/create', category_controller.createPost)

router.get('/category/:id/update', category_controller.updateGet)
router.post('/category/:id/update', category_controller.updatePost)

router.get('/category/:id/delete', category_controller.deleteGet)
router.post('/category/:id/delete', category_controller.deletePost)

router.get('/category/:id/detail', category_controller.detail)

// Item routes
router.get('/items', item_controller.list);

router.get('/item/create', item_controller.createGet)
router.post('/item/create', item_controller.createPost)

router.get('/item/:id/update', item_controller.updateGet)
router.post('/item/:id/update', item_controller.updatePost)

router.get('/item/:id/delete', item_controller.deleteGet)
router.post('/item/:id/delete', item_controller.deletePost)

router.get('/item/:id/detail', item_controller.detail)

module.exports = router;