const pool = require("../../db");
const queries = require("./queries");

const bcrypt = require("bcrypt");
const saltRounds = 12;
const default_password = "heslo";

const get_users = async (req, res) => {
  try {
    const search_query = await pool.query(queries.get_all_users);
    res.status(200).json(search_query.rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const get_user = async (req, res) => {
  try {
    const id = req.params.user_id;
    const find_query = await pool.query(queries.get_user_data, [id]);
    if (!find_query.rowCount) res.sendStatus(404);
    res.status(200).json(find_query.rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const add_user = async (req, res) => {
  const id = req.params.id;
  let { role, password, name, surname, email } = req.body;

  password = password ?? default_password;

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    try {
      if (err) throw err;
      const user_query = await pool.query(queries.add_user, [
        id,
        role,
        hash,
        name,
        surname,
        email,
      ]);
      res.status(201).json(user_query.rows[0]);
    } catch (error) {
      if (error.code === "22P02") return res.sendStatus(400);
      console.error(error);
      res.sendStatus(500);
    }
  });
};

const edit_user = async (req, res) => {
  try {
    const id = req.params.user_id;
    const { role, hash, name, surname, email } = req.body;

    const edit_query = await pool.query(
      queries.get_edit_query(role, hash, name, surname, email),
      [id, role, hash, name, surname, email].filter((value) => value)
    );

    if (!edit_query.rowCount) return res.sendStatus(404);
    res.status(202).json(edit_query.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const delete_user = async (req, res) => {
  try {
    const id = req.params.user_id;
    const delete_query = await pool.query(queries.delete_user, [id]);
    if (!delete_query.rowCount) res.sendStatus(404);
    res.sendStatus(202);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = {
  get_users,
  get_user,
  add_user,
  edit_user,
  delete_user,
};
