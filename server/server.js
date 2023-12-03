require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("./db");
const { query_database } = require("./middleware");

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
  const { id, password } = req.body;

  const [find_query, err] = await query_database(
    res,
    "select role, password from users where id=$1",
    [id]
  );
  if (err) return;

  if (!find_query.rowCount)
    return res.status(404).json({ error: `login ${id} was not found` });

  const hash = find_query.rows[0].password;
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    if (!result)
      return res.status(403).json({ error: "invalid login or password" });

    let user = {
      id,
      role: find_query.rows[0].role,
    };

    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    user = {
      ...user,
      token: access_token,
    };
    res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ALLOW);
    res.status(201).json(user);
  });
});

app.use("/users", user_router);
app.use("/rooms", rooms_router);
app.use("/courses", course_router);
app.use("/registrations", registration_router);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
