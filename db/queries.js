const category = require('../models/category');
const pool = require('./pool');

const tables = ['item', 'category', 'item_categories'];

exports.selectAll = async function (table) {
    if (!tables.includes(table)) {
        throw new Error('Invalid table')
    } 
    const {rows} = await pool.query(`SELECT * FROM ${table}`);
    return rows;
}

exports.selectById = async function (table, id) {
    if (!tables.includes(table)) {
        throw new Error('Invalid table')
    } 
    const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    return rows;
}

exports.createItem = async function(name, description, price, stock, category) {
    const { rows } = await pool.query('INSERT INTO item (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING id, url', [name, description, price, stock]);
    if (typeof category === 'array' && category) {
        await Promise.all(category.map(async (c) => {
            const categoryId = await pool.query('SELECT id FROM category WHERE name = $1', [c])
            await pool.query('INSERT INTO item_categories (item_id, category_id) VALUES ($1, $2)', [rows[0].id, categoryId])
        }))
    }
    return rows;
}

exports.createCategory = async function(name, description) {
    const { rows } = await pool.query('INSERT INTO category (name, description) VALUES ($1, $2) RETURNING url', [name, description]);
    return rows;
}

exports.updateItem = async function(name, description, price, stock, category, imgUrl, id) {
    const { rows } = await pool.query('UPDATE item SET name = $1, description = $2, price = $3, stock = $4, imgUrl = $5 WHERE id = $6 RETURNING id, url', [name, description, price, stock, imgUrl, id]);
    
    await pool.query('DELETE FROM item_categories WHERE item_id = $1', [rows[0].id]); // Resetting item categories
    if (category) {
        await Promise.all(Array.from(category).map(async (c) => {
            await pool.query('INSERT INTO item_categories (item_id, category_id) VALUES ($1, $2)', [id, c]);
        }))
    }

    return rows;
}

exports.updateCategory = async function(name, description, id) {
    const { rows } = await pool.query('UPDATE category SET name = $1, description = $2 WHERE id = $3 RETURNING url', [name, description, id]);
    return rows;
}

exports.deleteById = async function(table, id) {
    if (!tables.includes(table)) {
        throw new Error('Invalid table')
    } 

    if (table === 'item') {
        await pool.query('DELETE FROM item_categories WHERE item_id = $1', [id])
    } else if (table === 'category') {
        await pool.query('DELETE FROM item_categories WHERE category_id = $1', [id])
    }
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
}

exports.getUrl = async function (table, id) {
    if (!tables.includes(table)) {
        throw new Error('Invalid table')
    } 

    const { rows } = await pool.query(`SELECT url FROM ${table} WHERE id = $1`, [id]);
    return rows;
}

exports.getItemCategories = async function(id) {
    const { rows } = await pool.query('SELECT category.id, category.name, category.url FROM item JOIN item_categories ON item.id = item_id JOIN category ON category.id = category_id WHERE item_id = $1', [id]);
    return rows;
}

exports.getItemsWithCategory = async function(id) {
    const {rows} = await pool.query('SELECT item.id, item.name, item.url FROM item JOIN item_categories ON item.id = item_id JOIN category ON category.id = category_id WHERE category_id = $1', [id])
    return rows;
}

exports.countRows = async function(table) {
    if (!tables.includes(table)) {
        throw new Error('Invalid table')
    } 

    const {rows} = await pool.query(`SELECT COUNT(id) FROM ${table}`);
    return rows;
}

exports.countItemsWithCategory = async function(id) {
    const {rows} = await pool.query('SELECT count(item_id) FROM item_categories WHERE category_id = $1', [id]);
    return rows;
}