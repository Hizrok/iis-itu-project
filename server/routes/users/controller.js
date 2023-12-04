const pool = require("../../db");
const queries = require("./queries");
const { catch_query, query_database } = require("../../middleware");

const bcrypt = require("bcrypt");
const saltRounds = 12;
const default_password = "heslo";

const get_users = async (req, res) => {
  const [search_query, err] = await query_database(
    res,
    queries.get_all_users,
    []
  );
  if (err) return;

  const users = search_query.rows.map((u) => {
    return {
      id: u.id,
      role: u.role,
      name: u.name ? u.name : "",
      surname: u.surname ? u.surname : "",
      email: u.email ? u.email : "",
    };
  });

  res.status(200).json(users);
};

const get_guarantors = async (req, res) => {
  const [search_query, err] = await query_database(
    res,
    queries.get_guarantors,
    []
  );
  if (err) return;

  res.status(200).json(search_query.rows);
};

// TODO: courses and instances of a user
const get_user = async (req, res) => {
  const id = req.params.user_id;

  const [find_query, err] = await query_database(res, queries.get_user_data, [
    id,
  ]);
  if (err) return;

  if (!find_query.rowCount)
    res.status(404).json({ error: `user ${id} was not found` });

  const user = {
    id: find_query.rows[0].id,
    role: find_query.rows[0].role,
    name: find_query.rows[0].name ? find_query.rows[0].name : "",
    surname: find_query.rows[0].surname ? find_query.rows[0].surname : "",
    email: find_query.rows[0].email ? find_query.rows[0].email : "",
    courses: [],
    instances: [],
  };

  res.status(200).json(user);
};

const add_user = async (req, res) => {
  const id = req.params.user_id;
  let { role, password, name, surname, email } = req.body;

  password = password ?? default_password;

  bcrypt.hash(password, saltRounds, async function (error, hash) {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "bcrypt error" });
      return;
    }

    const [_, err] = await query_database(res, queries.add_user, [
      id,
      role,
      hash,
      name,
      surname,
      email,
    ]);
    if (err) return;

    res.status(201).json({ id });
  });
};

const edit_user = async (req, res) => {
  const id = req.params.user_id;
  const { role, hash, name, surname, email } = req.body;

  const [edit_query, err] = await query_database(
    res,
    queries.get_edit_query(role, hash, name, surname, email),
    [id, role, hash, name, surname, email].filter((value) => value)
  );
  if (err) return;

  if (!edit_query.rowCount)
    return res.status(404).json({ error: `user ${id} was not found` });

  res.status(202).json({ msg: `user ${id} was edited` });
};

const delete_user = async (req, res) => {
  const id = req.params.user_id;

  // -> students register courses and instances
  const [c_reg, c_reg_err] = await query_database(
    res,
    "delete from course_registrations where student=$1;",
    [id]
  );
  if (c_reg_err) return;

  const [i_reg, i_reg_err] = await query_database(
    res,
    "delete from course_activity_instance_registrations where student=$1;",
    [id]
  );
  if (i_reg_err) return;

  const [delete_query, err] = await query_database(res, queries.delete_user, [
    id,
  ]);
  if (err) return;

  if (!delete_query.rowCount)
    res.status(404).json({ error: `user ${id} was not found` });

  res.status(202).json({ msg: `user ${id} was deleted` });
};

module.exports = {
  get_users,
  get_guarantors,
  get_user,
  add_user,
  edit_user,
  delete_user,
};
