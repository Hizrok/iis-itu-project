const pool = require("../../db");
const queries = require("./queries");
const { query_database } = require("../../middleware");
const bcrypt = require("bcrypt");
const saltRounds = 12;

const generate_id = async (req, res, next) => {
  const surname = req.body.surname;
  if (!surname)
    return res.status(400).json({ error: "need surname to generate id" });

  let id = surname.substring(0, 5).toLowerCase();
  const [similar_ids, err] = await query_database(
    res,
    queries.get_similar_ids,
    [id]
  );
  if (err) return;

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

  req.params.user_id = id;
  next();
};

const check_password = async (req, res, next) => {
  const id = req.params.user_id;
  const password = req.body.password;

  if (password) {
    const [find_query, err] = await query_database(
      res,
      "select password from users where id=$1;",
      [id]
    );
    if (err) return err;

    if (!find_query.rowCount)
      return res.status(404).json({ error: `user ${id} was not found` });

    bcrypt.compare(password, find_query.rows[0].password, (err, result) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      if (result)
        return res
          .status(400)
          .json({ error: "new password is the same as the old password" });

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        req.body.hash = hash;
        next();
      });
    });
  } else {
    next();
  }
};

module.exports = {
  generate_id,
  check_password,
};
