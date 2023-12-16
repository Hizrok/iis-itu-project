const pool = require("../../db");
const { query_database } = require("../../middleware");
const queries = require("./queries");

const get_active_registration = async (req, res, next) => {
  try {
    const [find_query, err] = await query_database(
      res,
      queries.get_active_registration
    );
    if (err) return;

    req.params.active = !find_query.rowCount ? null : find_query.rows[0];
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

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
  get_active_registration,
};
