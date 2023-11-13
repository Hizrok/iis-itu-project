const express = require("express");
const cors = require("cors");

const user_router = require("./routes/users/routes");
const course_router = require("./routes/courses/routes");
const rooms_router = require("./routes/rooms/routes");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/users", user_router);
app.use("/courses", course_router);
app.use("/rooms", rooms_router);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
