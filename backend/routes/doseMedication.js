const express = require("express");
const error = require("../functions/error");
const DB = require("../db/index");

const doseMedication = express.Router();

doseMedication.post("/get", async (req, res) => {
    const { dose_id } = req.body;

    try {
        const queryResult = await DB.doseMedication.get({ dose_id });
        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

doseMedication.post("/create", async (req, res) => {
    const { dose_id, medications } = req.body;

    try {
        const queryResult = await DB.doseMedication.create({ dose_id, medications });
        if(queryResult.affectedRows) console.log("New row has been inserted in DoseMedication table.");
   
        res.status(200).json(queryResult.insertId);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

doseMedication.post("/take", async (req, res) => {
    const { dose, doseMedications } = req.body;

    try {
        const doseQueryResult = await DB.dose.setStatusTaken({ dose });
        if(doseQueryResult.affectedRows) console.log("Rows have been updated in Dose table.");
        
        const medicationQueryResult = await DB.medication.decrease({ doseMedications });
        if(medicationQueryResult.affectedRows) console.log("Rows have been updated in Medication table.");

        res.status(200).json({ success: true });
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

module.exports = doseMedication;