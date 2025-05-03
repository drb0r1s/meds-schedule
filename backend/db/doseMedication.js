const connection = require("./connection");

const dataPool = {};

dataPool.get = ({ dose_id }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT m.*, dm.* FROM DoseMedication dm JOIN Medication m ON dm.medication_id = m.id WHERE dm.dose_id = ?", [dose_id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.create = ({ dose_id, medications }) => {
    let questionmarks = "";
    const values = [];

    for(let i = 0; i < medications.length; i++) {
        if(i < medications.length - 1) questionmarks += "(?,?,?,?),";
        else questionmarks += "(?,?,?,?)";

        const { id, amount, amountUnit } = medications[i];
        values.push(dose_id, id, amount, amountUnit);
    }
    
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO DoseMedication (dose_id, medication_id, amount, amount_unit) VALUES ${questionmarks}`, values, (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;