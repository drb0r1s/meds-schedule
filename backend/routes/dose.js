const express = require("express");
const error = require("../functions/error");
const DB = require("../db/index");
const ExtendedDate = require("../functions/ExtendedDate");

const dose = express.Router();

dose.post("/create", async (req, res) => {
    const { schedule_id, name, description, medication, time, color } = req.body;

    const isError = checkInputs({ name, description, medication, time, color }, res);
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

function checkInputs(inputs, res) {
    if(!inputs.name.length) return error(res, { message: "Name field is empty." });
    else if(!inputs.time.hours.length) return error(res, { message: "Hours field is empty." });
    else if(!inputs.time.minutes.length) return error(res, { message: "Minutes field is empty." });
    else if(inputs.name.length < 3 || inputs.name.length > 64) return error(res, { message: "Name length should be greater than 2 or less than 64!" });
    else if(checkMedicationInputs()) return error(res, { message: "Medications are invalid." });
    else if(isNaN(parseInt(inputs.time.hours)) || isNaN(parseInt(inputs.time.minutes)) || isNaN(parseInt(inputs.time.day)) || isNaN(parseInt(inputs.time.month)) || isNaN(parseInt(inputs.time.year))) return error(res, { message: "Time is invalid." });
    else if(parseInt(inputs.time.hours) < 0 || parseInt(inputs.time.hours) > 23) return error(res, { message: "Hours field is invalid." });
    else if(parseInt(inputs.time.minutes) < 0 || parseInt(inputs.time.minutes) > 59) return error(res, { message: "Minutes field is invalid." });
    else if(parseInt(inputs.time.month) < 1 || parseInt(inputs.time.month) > 12) return error(res, { message: "Month is invalid." });
    else if(parseInt(inputs.time.day) < 1 || parseInt(inputs.time.day) > 31 || parseInt(inputs.time.day) > ExtendedDate.monthLengths[parseInt(inputs.time.month) - 1]) return error(res, { message: "Day is invalid." });
    else if(parseInt(inputs.time.year) < new Date().getFullYear() || parseInt(inputs.time.year) > new Date().getFullYear() + 10) return error(res, { message: "Year is invalid." });

    return false;

    function checkMedicationInputs() {
        const amountUnits = ["mg", "g", "mcg", "ml", "l", "pills", "capsules", "drops", "patches", "inhalations", "other"];
        
        for(let i = 0; i < inputs.medication.length - 1; i++) {
            if(
                inputs.medication[i].name.length < 3 ||
                inputs.medication[i].name.length > 64 ||
                isNaN(parseInt(inputs.medication[i].amount)) ||
                parseInt(inputs.medication[i].amount) <= 0 ||
                parseInt(inputs.medication[i].amount) > 100000 ||
                amountUnits.indexOf(inputs.medication[i].amountUnit) === -1
            ) return true;
        }

        return false;
    }
}

module.exports = dose;