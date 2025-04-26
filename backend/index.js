const express = require("express");
const cors = require("cors");
require("dotenv").config();
const DB = require("./db/index.js");

const port = 9999;

const app = express();
app.use(cors());

app.listen(port, () => console.log(`Server is listening on http://88.200.63.148:9998/`));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

const family = require("./routes/family.js");
app.use("/family", family);