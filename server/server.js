require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const user_router = require("./routes/users/routes");
const course_router = require("./routes/courses/routes");
const rooms_router = require("./routes/rooms/routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/login", (req, res) => {
  // TODO: authenticate
  const { login, role } = req.body;
  const user = {
    login,
    role,
  };

  const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.status(201).json({ token: access_token });
});

app.use("/users", user_router);
app.use("/courses", course_router);
app.use("/rooms", rooms_router);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
