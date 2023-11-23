require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("./db");

const user_router = require("./routes/users/routes");
const course_router = require("./routes/courses/routes");
const rooms_router = require("./routes/rooms/routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/login", async (req, res) => {
  console.log("recieved POST request - /login");
  try {
    const { login, password } = req.body;

    const find_query = await pool.query(
      "select user_role as role, user_password as password from users where user_login = $1",
      [login]
    );

    if (!find_query.rowCount) {
      console.log("sending response 404");
      return res.status(404).json({ error: `user ${login} not found` });
    }

    const hash = find_query.rows[0].password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) throw err;
      if (!result) {
        console.log("sending response 403");
        return res.status(403).json({ error: "invalid authentication" });
      }

      let user = {
        login,
        role: find_query.rows[0].role,
      };

      const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

      user = {
        ...user,
        token: access_token,
      };

      console.log("sending response 201");
      res.status(201).json(user);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

app.use("/users", user_router);
app.use("/courses", course_router);
app.use("/rooms", rooms_router);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
