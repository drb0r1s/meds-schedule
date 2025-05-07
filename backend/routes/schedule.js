const express = require("express");
const error = require("../functions/error");
const DB = require("../db/index");
const ExtendedDate = require("../functions/ExtendedDate");
const CheckInputs = require("../functions/CheckInputs");

const schedule = express.Router();

schedule.post("/get", async (req, res) => {
    const { id } = req.body;
    
    try {
        const queryResult = await DB.schedule.get({ id });
        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

schedule.post("/create", async (req, res) => {
    const { family_id, name, description, color } = req.body;

    const isError = CheckInputs.schedule({ name }, res);
    if(isError) return;

    const createObject = {
        family_id,
        name,
        description,
        color,
        created_at: ExtendedDate.now(),
        updated_at: ExtendedDate.now()
    };

    try {
        const queryResult = await DB.schedule.create(createObject);
        if(queryResult.affectedRows) console.log("New row has been inserted in Schedule table.");
    
        res.status(200).json({ ...createObject, id: queryResult.insertId });
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

schedule.post("/get-doses", async (req, res) => {
    const { id } = req.body;

    try {
        const queryResult = await DB.schedule.getDoses({ id });
        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

module.exports = schedule;