require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const bcrypt = require("bcrypt");
const saltRounds = 12;

const user_router = require("./routes/users/routes");
const course_router = require("./routes/courses/routes");
const rooms_router = require("./routes/rooms/routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    const user_query = await pool.query(
      "select * from users where user_login = $1",
      [login]
    );

    if (user_query.rows.length == 0) {
      return res.status(404).json({ error: `user ${login} not found` });
    }

    const hash = user_query.rows[0].user_password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) throw err;
      if (!result) return res.sendStatus(403);

      let user = {
        login,
        role: user_query.rows[0].user_role,
      };

      const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      
      user = {
        ...user,
        token: access_token,
      };

      res.status(201).json(user);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.use("/users", user_router);
app.use("/courses", course_router);
app.use("/rooms", rooms_router);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
