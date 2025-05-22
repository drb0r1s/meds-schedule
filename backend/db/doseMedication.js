const connection = require("./connection");

const dataPool = {};

dataPool.get = ({ id, type }) => {
    const joinMedication = "SELECT m.id AS medication_id, m.account_id, m.name, m.description, m.substance, m.expiration_date, m.amount, m.amount_unit, dm.id, dm.dose_id, dm.amount AS amount_to_take FROM DoseMedication dm JOIN Medication m ON dm.medication_id = m.id WHERE dm.dose_id = ?";
    const joinDose = "SELECT d.id AS dose_id, d.schedule_id, d.name, d.description, d.time, d.status, d.color, dm.id, dm.medication_id, dm.amount AS amount_to_take, dm.amount_unit FROM DoseMedication dm JOIN Dose d ON dm.dose_id = d.id WHERE dm.medication_id = ?";
    
    return new Promise((resolve, reject) => {
        connection.query(type === "dose" ? joinMedication : joinDose, [id], (err, res) => {
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