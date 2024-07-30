const { Pool } = require("pg");

module.exports = new Pool();  // No options = will use defaults