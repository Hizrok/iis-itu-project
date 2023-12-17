require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticate = (roles, id = false) => {
  return (req, res, next) => {
    const auth_header = req.headers["authorization"];
    const token = auth_header && auth_header.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      const role_check = roles.includes(user.role);
      const id_check = id && req.params.id === user.id;
      if (!role_check && !id_check) return res.sendStatus(403);

      req.params.user = user;
      next();
    });
  };
};

module.exports = {
  authenticate,
};
