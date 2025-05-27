const express = require("express");
const error = require("../functions/error");
const DB = require("../db/index");
const ExtendedDate = require("../functions/ExtendedDate");

const event = express.Router();

event.post("/create", async (req, res) => {
    const { value } = req.body;

    const createObject = {
        ...value,
        created_at: ExtendedDate.now()
    };

    try {
        const queryResult = await DB.event.create(createObject);
        if(queryResult.affectedRows) console.log("New row has been inserted in Event table.");
        
        res.status(200).json({ ...createObject, id: queryResult.insertId });
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

event.get("/:account_id/get-all", async (req, res) => {
    const { account_id } = req.params;

    try {
        const queryResult = await DB.event.getAll({ account_id });
        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

module.exports = event;