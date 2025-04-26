const express = require("express");
const family = express.Router();

family.post("/register", (req, res) => {
    const data = req.body;
    console.log(data);

    res.status(200).json({ message: "Success!" });
});

module.exports = family;