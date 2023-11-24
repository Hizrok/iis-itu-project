const pool = require("../../db");
const queries = require("./queries");
const bcrypt = require("bcrypt");
const saltRounds = 12;

const generate_id = async (req, res, next) => {
  try {
    const surname = req.body.surname;
    if (!surname) return res.sendStatus(400);

    let id = surname.substring(0, 5).toLowerCase();
    const similar_ids = await pool.query(queries.get_similar_ids, [id]);

    taken_numbers = similar_ids.rows.map((l) => l.id);
    taken_numbers = taken_numbers.filter(
      (l) => id.length === l.substring(0, l.length - 2).length
    );
    taken_numbers = taken_numbers.map((l) =>
      parseInt(l.substring(l.length - 2, l.length))
    );

    for (let i = 0; i < 100; i++) {
      if (!taken_numbers.includes(i)) {
        id_number = "";
        if (i < 10) {
          id_number += "0";
        }
        id_number += i.toString();
        id += id_number;
        break;
      }
    }

    req.params.id = id;
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const check_password = async (req, res, next) => {
  const id = req.params.id;
  const password = req.body.password;

  if (password) {
    try {
      const find_query = await pool.query(
        "select password from users where id=$1;",
        [id]
      );
      if (!find_query.rowCount) return res.sendStatus(404);
      bcrypt.compare(password, find_query.rows[0].password, (err, result) => {
        if (err) return res.sendStatus(500);
        if (result) return res.sendStatus(400);

        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) return res.sendStatus(500);
          req.body.hash = hash;
          next();
        });
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  } else {
    next();
  }
};

module.exports = {
  generate_id,
  check_password,
};
