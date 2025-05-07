const express = require("express");
const error = require("../functions/error");
const DB = require("../db/index");
const ExtendedDate = require("../functions/ExtendedDate");
const CheckInputs = require("../functions/CheckInputs");

const dose = express.Router();

dose.post("/create", async (req, res) => {
    const { schedule_id, name, description, medication, time, color } = req.body;

    const isError = CheckInputs.dose({ name, description, medication, time, color }, res);
    if(isError) return;

    const createObject = {
        schedule_id,
        name,
        description,
        time: `${time.year}-${time.month >= 10 ? time.month : `0${time.month}`}-${time.day >= 10 ? time.day : `0${time.day}`} ${time.hours >= 10 ? time.hours : `0${time.hours}`}:${time.minutes >= 10 ? time.minutes : `0${time.minutes}`}:00`,
        status: "pending",
        color,
        created_at: ExtendedDate.now(),
        updated_at: ExtendedDate.now()
    };

    try {
        const queryResult = await DB.dose.create(createObject);
        if(queryResult.affectedRows) console.log("New row has been inserted in Dose table.");
   
        res.status(200).json({ ...createObject, id: queryResult.insertId });
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

dose.post("/update", async (req, res) => {
    const { id, value } = req.body;

    let updateObject = {};
    const blockKeys = [];

    Object.values(value).forEach((prop, index) => {
        const key = Object.keys(value)[index];
        if(blockKeys.indexOf(key) > -1) return;

        if(prop) updateObject = {...updateObject, [key]: prop};
    });

    const isError = CheckInputs.dose(updateObject, res);
    if(isError) return;

    try {
        const queryResult = await DB.dose.update({ id, updateObject });
        if(queryResult.affectedRows) console.log("Row has been updated in Dose table.");

        res.status(200).json(updateObject);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

module.exports = dose;