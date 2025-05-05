const express = require("express");
const error = require("../functions/error");
const DB = require("../db/index");
const ExtendedDate = require("../functions/ExtendedDate");

const medication = express.Router();

medication.post("/create", async (req, res) => {
    const { family_id, name, description, substance, expirationDate, amount, amountUnit } = req.body;

    const isError = checkInputs({ name, description, substance, expirationDate, amount, amountUnit }, res);
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

medication.post("/decrease", async (req, res) => {
    const { values } = req.body;

    
});

const amountUnits = ["mg", "g", "mcg", "ml", "l", "pills", "capsules", "drops", "patches", "inhalations", "other"];

function checkInputs(inputs, res) {
    if(!inputs.name.length) return error(res, { message: "Name field is empty." });
    else if(!inputs.substance.length) return error(res, { message: "Substance field is empty." });
    else if(!inputs.expirationDate.day.length) return error(res, { message: "Day field is empty." });
    else if(!inputs.expirationDate.month.length) return error(res, { message: "Month field is empty." });
    else if(!inputs.expirationDate.year.length) return error(res, { message: "Year field is empty." });
    else if(!inputs.amount.length) return error(res, { message: "Amount field is empty." });
    else if(!inputs.amountUnit.length) return error(res, { message: "Amount unit field is empty." });
    else if(inputs.name.length < 3 || inputs.name.length > 64) return error(res, { message: "Name length should be greater than 2 or less than 64!" });
    else if(inputs.substance.length < 3 || inputs.substance.length > 64) return error(res, { message: "Substance name length should be greater than 2 or less than 64!" });
    else if(isNaN(parseInt(inputs.expirationDate.day)) || isNaN(parseInt(inputs.expirationDate.month)) || isNaN(parseInt(inputs.expirationDate.year))) return error(res, { message: "Expiration date is invalid." });
    else if(parseInt(inputs.expirationDate.month) < 1 || parseInt(inputs.expirationDate.month) > 12) return error(res, { message: "Month is invalid." });
    else if(parseInt(inputs.expirationDate.day) < 1 || parseInt(inputs.expirationDate.day) > 31 || parseInt(inputs.expirationDate.day) > ExtendedDate.monthLengths[parseInt(inputs.expirationDate.month) - 1]) return error(res, { message: "Day is invalid." });
    else if(parseInt(inputs.expirationDate.year) < new Date().getFullYear() || parseInt(inputs.expirationDate.year) > new Date().getFullYear() + 10) return error(res, { message: "Year is invalid." });
    else if(isNaN(parseInt(inputs.amount)) || parseInt(inputs.amount) < 0 || parseInt(inputs.amount) > 100000) return error(res, { message: "Amount is invalid." });
    else if(amountUnits.indexOf(inputs.amountUnit) === -1) return error(res, { message: "Amount unit is invalid." });

    return false;
}

module.exports = medication;