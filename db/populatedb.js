#! /usr/bin/env node
require('dotenv').config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS category (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  description text,
  url text GENERATED ALWAYS AS ('/inventory/category/' || id) STORED
);

CREATE TABLE IF NOT EXISTS item (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  stock integer NOT NULL,
  imgurl text,
  url text GENERATED ALWAYS AS ('/inventory/item/' || id) STORED
);

CREATE TABLE IF NOT EXISTS item_categories (
  item_id integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (item_id, category_id),
  FOREIGN KEY (item_id) REFERENCES item (id),
  FOREIGN KEY (category_id) REFERENCES category (id)
);

INSERT INTO category (name, description) 
VALUES
  ('Technology', 'Electronic devices and futuristic things'),
  ('Food', 'To eat'),
  ('Kitchen', 'For cooking and eating'),
  ('Books', 'For reading'),
  ('Furniture', 'Chairs to sit and similar stuff'),
  ('Clothing', 'Cover your body')
;

INSERT INTO item (name, description, price, stock, imgurl)
VALUES
  ('Big apple', 'It is very big', 1000, 1, 'https://res.cloudinary.com/dxivfk8tv/image/upload/v1720630425/ckrfkuv1ejunbztj8i5d.jpg'),
  ('Spoon', 'Regular sized', 2, 3212, 'https://res.cloudinary.com/dxivfk8tv/image/upload/v1720635394/agl0f1y0vdkocbkp3fxh.jpg'),
  ('1984', 'Literally 1984 (17th anniversary edition).', 17, 38, 'https://res.cloudinary.com/dxivfk8tv/image/upload/v1720626088/gbm6p506xx2cw8lkv5jg.jpg'),
  ('Banana', 'Yellow banan', 1, 321, 'https://res.cloudinary.com/dxivfk8tv/image/upload/v1722292471/ossy9k9l1hcrayy0ukk0.jpg'),
  ('Pan', 'Of the frying variety', 30, 2, 'https://res.cloudinary.com/dxivfk8tv/image/upload/v1720630508/m76eexocxmpmoxf5cloh.png'),
  ('Chair', 'Wooden and cushioned', 50, 50, 'https://res.cloudinary.com/dxivfk8tv/image/upload/v1720623039/samples/chair.png'),
  ('Shoe', 'singular', 200, 12, 'https://res.cloudinary.com/dxivfk8tv/image/upload/v1720623035/samples/shoe.jpg'),
  ('Leather bag', 'stylish', 500, 2, 'https://res.cloudinary.com/dxivfk8tv/image/upload/v1720623019/samples/ecommerce/leather-bag-gray.jpg')
;

INSERT INTO item_categories (item_id, category_id)
VALUES
  (1, 1),
  (1, 2),
  (2, 3),
  (3, 4),
  (4, 2),
  (5, 3),
  (6, 5),
  (7, 6),
  (8, 6)
;
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.POSTGRES_URI
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
