const express = require("express");
const cors = require("cors");

const pool = require("./db");
const user_router = require("./routes/users/routes");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/users", user_router);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});