const pool = require("../../db");
const queries = require("./queries");

const get_state = async (req, res, next) => {
  try {
    const id = req.params.id;

    const find_query = await pool.query(queries.get_registration, [id]);

    if (!find_query.rowCount) return res.sendStatus(404);

    const status = find_query.rows[0].status;
    if (status !== "ACTIVE") return res.sendStatus(400);

    req.params.state = find_query.rows[0].state;
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  get_state,
};