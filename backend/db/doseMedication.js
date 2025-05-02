const connection = require("./connection");

const dataPool = {};

dataPool.create = ({ dose_id, medications }) => {
    let questionmarks = "";
    const values = [];

    for(let i = 0; i < medications.length; i++) {
        if(i < medications.length - 1) questionmarks += "(?,?,?,?),";
        else questionmarks += "(?,?,?,?)";

        values.push(dose_id);
        values.push(...medications[i]);
    }
    
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO DoseMedication (dose_id, medication_id, amount, amount_unit) VALUES ${questionmarks}`, values, (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;