require("dotenv").config();
const pool = require("./db");
const jwt = require("jsonwebtoken");

const authenticate = (roles, ids = []) => {
  return (req, res, next) => {
    const auth_header = req.headers["authorization"];
    const token = auth_header && auth_header.split(" ")[1];
    if (token == null)
      return res
        .status(401)
        .json({ error: "authentification failed - token not found" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({
          error: "authentification failed - JWT token verification failed",
        });

      const role_check = roles.includes(user.role);

      let id_check = false;
      for (let index = 0; index < ids.length; index++) {
        if (user.role === ids[index] && user.id === req.params.user_id) {
          id_check = true;
          break;
        }
      }

      if (!role_check && !id_check)
        return res
          .status(403)
          .json({ error: "authentification failed - forbidden role or id" });

      req.params.user = user;
      next();
    });
  };
};

const query_database = async (res, query, params) => {
  try {
    const search_query = await pool.query(query, params);
    return [search_query, false];
  } catch (err) {
    if (err.code && err.table && err.detail) {
      console.error(`[${err.code}] ${err.detail} (${err.table})`);
    } else {
      console.error(err);
    }

    switch (err.code) {
      case "23503":
        res.status(400).json({ error: "foreign key violation" });
        break;
      default:
        res.sendStatus(500);
        break;
    }
    return [null, true];
  }
};

module.exports = {
  authenticate,
  query_database,
};
