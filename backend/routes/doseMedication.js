const express = require("express");
const error = require("../functions/error");
const DB = require("../db/index");

const doseMedication = express.Router();

doseMedication.post("/get", async (req, res) => {
    const { id, type } = req.body;

    try {
        const queryResult = await DB.doseMedication.get({ id, type });
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

    if(dose.status !== "pending") return;

    const isError = checkAmount(doseMedications);
    if(isError) return error(res, { message: "Not enough medications in the inventory." });

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

function checkAmount(doseMedications) {
    let status = false;

    for(let i = 0; i < doseMedications.length; i++) {
        if(doseMedications[i].amount < doseMedications[i].amount_to_take) {
            status = true;
            break;
        }
    }

    return status;
}

module.exports = doseMedication;