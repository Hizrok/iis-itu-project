const Pool = require("pg").Pool;

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "iis_itu_pgdb",
	password: "postgres",
	port: 5432
});

module.exports = pool;