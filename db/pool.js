const { Pool } = require("pg");

module.exports = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
        ca: process.env.PGSSLROOTCERT ? fs.readFileSync(process.env.PGSSLROOTCERT).toString() : undefined
      }
});