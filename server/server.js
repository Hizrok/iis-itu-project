require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("./db");

const user_router = require("./routes/users/routes");
const rooms_router = require("./routes/rooms/routes");
const course_router = require("./routes/courses/routes");
const registration_router = require("./routes/registrations/routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.post("/login", async (req, res) => {
  try {
    const { id, password } = req.body;

    const find_query = await pool.query(
      "select role, password from users where id=$1",
      [id]
    );

    if (!find_query.rowCount) return res.sendStatus(404);

    const hash = find_query.rows[0].password;
    bcrypt.compare(password, hash, (err, result) => {
      if (err) throw err;
      if (!result) return res.sendStatus(403);

      let user = {
        id,
        role: find_query.rows[0].role,
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
app.use("/rooms", rooms_router);
app.use("/courses", course_router);
app.use("/registrations", registration_router);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
