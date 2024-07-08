#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name) {
  const category = new Category({name: name});
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`)
}

async function itemCreate(index, name, description, price, stock, category) {
  const itemDetail = {
    name: name,
    description: description,
    price: price,
    stock: stock
  }
  if (category !== false) {  // If category exists 
    itemDetail.category = category
  }

  const item = new Item(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Food"),
    categoryCreate(1, "Technology"),
    categoryCreate(2, "Book"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
   itemCreate(0, 'Apple', 'Very red and scrumptious', 2, 123, [categories[0]]),
   itemCreate(1, 'Banana', 'Yellow and delicious', 1, 420, [categories[0]]),
   itemCreate(2, 'Razer Deathadder', 'Gaming mouse for pros', 100, 30, [categories[1]]),
   itemCreate(3, '1984 by George Orwell', "Literally 1984", 10, 100, [categories[2]]),
   itemCreate(4, 'Tiny apple', "It's very small", 1000, 1, [categories[0], categories[1]])
  ]);
}