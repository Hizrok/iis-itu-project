const pool = require("../../db");
const queries = require("./queries");

const bcrypt = require("bcrypt");
const saltRounds = 12;
const default_password = "heslo";

const valid_roles = ["admin", "garant", "vyučující", "rozvrhář", "student"];

const get_users = async (req, res) => {
  console.log("recieved GET request - /users");
  try {
    if (req.user.role !== "admin") return res.sendStatus(403);

    const search_query = await pool.query(queries.get_all_users);

    console.log("sending response 200");
    res.status(200).json(search_query.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "get_users - internal server error" });
  }
};

const get_user_by_login = async (req, res) => {
  console.log(`recieved GET request - /users/${req.params.login}`);
  try {
    const login = req.params.login;

    if (req.user.role !== "admin" && req.user.login !== login) {
      console.log("sending response 403");
      return res
        .status(403)
        .json({ error: `you don't have permission to acces user ${login}` });
    }

    const find_query = await pool.query(queries.get_user_by_login, [login]);
    if (find_query.rowCount) {
      const user = find_query.rows[0];
      delete user.password;

      console.log("sending response 200");
      res.status(200).json(user);
    } else {
      console.log("sending response 404");
      res.status(404).json({ error: `user ${login} not found` });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "get_user_by_login - internal server error" });
  }
};

const generate_login = async (surname_substring) => {
  let login = surname_substring;
  const similar_logins = await pool.query(queries.get_similar_logins, [login]);

  taken_numbers = similar_logins.rows.map((l) => l.user_login);
  taken_numbers = taken_numbers.filter(
    (l) => login.length === l.substring(0, l.length - 2).length
  );
  taken_numbers = taken_numbers.map((l) =>
    parseInt(l.substring(l.length - 2, l.length))
  );

  for (let i = 0; i < 100; i++) {
    if (!taken_numbers.includes(i)) {
      login_number = "";
      if (i < 10) {
        login_number += "0";
      }
      login_number += i.toString();
      login += login_number;
      break;
    }
  }

  return login;
};

const add_user = async (req, res) => {
  console.log("recieved POST request - /users");
  try {
    if (req.user.role !== "admin") {
      console.log("sending response 403");
      return res
        .status(403)
        .json({ error: "you don't have permission to add a new user" });
    }

    let { role, password, name, surname, email } = req.body;

    if (!valid_roles.includes(role)) {
      console.log("sending response 400");
      return res.status(400).json({ error: `role ${role} is invalid` });
    }

    password = password ?? default_password;

    if (!surname) {
      console.log("sending response 400");
      return res
        .status(400)
        .json({ error: "cannot generate login without surname" });
    }

    const surname_substring = surname.substring(0, 5).toLowerCase();
    const login = await generate_login(surname_substring);

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) throw err;
      const user_query = await pool.query(queries.add_user, [
        role,
        login,
        hash,
        name,
        surname,
        email,
      ]);

      console.log("sending response 201");
      res
        .status(201)
        .json({
          msg: `successfully added user ${login}`,
          user: user_query.rows[0],
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "add_user - internal server error" });
  }
};

const edit_user = async (req, res) => {
  console.log(`recieved PUT request - /users/${req.params.login}`);
  try {
    const login = req.params.login;
    const { role, password, name, surname, email } = req.body;

    if (req.user.role !== "admin" && req.user.login !== login) {
      console.log("sending response 403");
      return res
        .status(403)
        .json({ error: `you dont have permission to edit user ${login}` });
    }

    if (!role && !password && !name && !surname && !email) {
      console.log("sending response 400");
      return res.status(400).json({ error: "invalid edit request" });
    }

    const find_query = await pool.query(queries.get_user_by_login, [login]);
    if (!find_query.rowCount) {
      console.log("sending response 404");
      return res.status(404).json({ error: `user ${login} was not found` });
    }
    let user = find_query.rows[0];

    bcrypt.compare(password ?? "", user.password, async function (err, result) {
      if (err) throw err;

      if (result) {
        console.log("sending response 400");
        return res
          .status(400)
          .json({ error: `new password cannot be the same as old password` });
      }

      bcrypt.hash(password ?? "", saltRounds, async function (err, hash) {
        if (err) throw err;
        user.role = role ?? user.role;
        user.name = name ?? user.name;
        user.surname = surname ?? user.surname;
        user.password = password ? hash : user.password;
        user.email = email ?? user.email;

        const edit_query = await pool.query(queries.edit_user, [
          user.role,
          user.name,
          user.surname,
          user.password,
          user.email,
          user.login,
        ]);

        console.log("sending response 202");
        res.status(202).json({
          msg: `successfully edited user ${login}`,
          user: edit_query.rows[0],
        });
      });
    });
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const delete_user = async (req, res) => {
  console.log(`recieved DELETE request - /users/${req.params.login}`);
  try {
    const login = req.params.login;

    if (req.user.role !== "admin" && req.user.login !== login)
      return res.sendStatus(403);

    const delete_query = await pool.query(queries.delete_user, [login]);
    // delete query will be one if user with that login was found
    if (delete_query.rowCount) {
      res.status(202).json({ msg: `successfully deleted user ${login}` });
    } else {
      res.status(404).json({ error: `user ${login} was not found` });
    }
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

module.exports = {
  get_users,
  get_user_by_login,
  add_user,
  edit_user,
  delete_user,
};
