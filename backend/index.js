const express = require("express");
require("dotenv").config();
const DB = require("./db/index.js");

const app = express();
const port = 9998;

app.listen(port, () => console.log("Listening on http://localhost:9998"));

app.get("/", (req, res) => {
    res.send("Hello world!");
});