const express = require("express");
const error = require("../functions/error");
const DB = require("../db/index");
const ExtendedDate = require("../functions/ExtendedDate");
const CheckInputs = require("../functions/CheckInputs");

const medication = express.Router();

medication.post("/create", async (req, res) => {
    const { family_id, name, description, substance, expirationDate, amount, amountUnit } = req.body;

    const isError = CheckInputs.medication({ name, description, substance, expirationDate, amount, amountUnit }, res);
    if(isError) return;

    const createObject = {
        family_id,
        name,
        description,
        substance,
        expiration_date: `${expirationDate.year}-${expirationDate.month >= 10 ? expirationDate.month : `0${expirationDate.month}`}-${expirationDate.day >= 10 ? expirationDate.day : `0${expirationDate.day}`}`,
        amount,
        amount_unit: amountUnit,
        created_at: ExtendedDate.now(),
        updated_at: ExtendedDate.now()
    };

    try {
        const queryResult = await DB.medication.create(createObject);
        if(queryResult.affectedRows) console.log("New row has been inserted in Medication table.");
   
        res.status(200).json({ ...createObject, id: queryResult.insertId });
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

medication.post("/update", async (req, res) => {
    const { id, value } = req.body;

    const parsedExpirationDate = `${value.expirationDate.year}-${value.expirationDate.month >= 10 ? value.expirationDate.month : `0${value.expirationDate.month}`}-${value.expirationDate.day >= 10 ? value.expirationDate.day : `0${value.expirationDate.day}`}`;
    const parsedValue = {...value, expiration_date: parsedExpirationDate, amount_unit: value.amountUnit};

    let updateObject = { updated_at: ExtendedDate.now() };
    // We want to block "expirationDate" and "amountUnit" keys (camelCase) from being sent to the server, because properties are saved as "expiration_date" and "amount_unit" on the server (snake_case).
    const blockKeys = ["expirationDate", "amountUnit"];

    Object.values(parsedValue).forEach((prop, index) => {
        const key = Object.keys(parsedValue)[index];
        if(blockKeys.indexOf(key) > -1) return;

        if(prop) updateObject = {...updateObject, [key]: prop};
    });

    const isError = CheckInputs.medication(value, res);
    if(isError) return;

    try {
        const queryResult = await DB.medication.update({ id, updateObject });
        if(queryResult.affectedRows) console.log("Row has been updated in Medication table.");

        res.status(200).json(updateObject);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

medication.post("/delete", async (req, res) => {
    const { id } = req.body;

    try {
        const queryResult = await DB.medication.delete({ id });
        if(queryResult.affectedRows) console.log("Row has been deleted from Medication table.")
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

medication.post("/check-existence", async (req, res) => {
    const { family_id, medications } = req.body;

    const medicationNames = [];

    for(let i = 0; i < medications.length; i++) medicationNames.push(medications[i].name);

    try {
        const queryResult = await DB.medication.getSpecific({ family_id, names: medicationNames });
        
        let status;
        const idMedications = [];

        if(queryResult.length !== medications.length) status = { message: "Some of the entered medications don't exist in the inventory." };

        for(let i = 0; i < medications.length; i++) {
            for(let j = 0; j < queryResult.length; j++) {
                if(medications[i].name !== queryResult[j].name) continue;

                if(medications[i].amount > queryResult[j].amount) {
                    status = { message: `There is not enough ${medications[i].name} in the inventory.` };
                    break;
                }

                if(medications[i].amountUnit !== queryResult[j].amount_unit) {
                    status = { message: `Unit for ${medications[i].name} is not the same as in inventory.` };
                    break;
                }

                // If no input violation happened, we are just going to assign each medication object proper id, based on matching name with rows from Medication table (queryResult).
                idMedications.push({...medications[i], id: queryResult[j].id});
            }
        }

        if(!status?.message) status = idMedications;
        
        res.status(200).json(status);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

module.exports = medication;