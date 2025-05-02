const express = require("express");
const error = require("../functions/error");
const DB = require("../db/index");

const doseMedication = express.Router();

doseMedication.post("/create", async (req, res) => {
    const { dose_id, medications } = req.body;

    try {
        const queryResult = DB.doseMedication.create({ dose_id, medications });
        if(queryResult.affectedRows) console.log("New row has been inserted in DoseMedication table.");
   
        res.status(200).json(queryResult.insertId);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

module.exports = doseMedication;