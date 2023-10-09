const express = require("express");
const cors = require("cors");

const app = express();

const port = 3000;

app.use(cors());

app.get("/", (req, res) => {

	console.log("get request");

	res.status(200).json({ example: "data"});
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});