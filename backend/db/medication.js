const connection = require("../db/connection");

const dataPool = {};

dataPool.create = ({ family_id, name, description, substance, expiration_date, amount, amount_unit, created_at, updated_at }) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Medication (family_id, name, description, substance, expiration_date, amount, amount_unit, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)", [family_id, name, description, substance, expiration_date, amount, amount_unit, created_at, updated_at], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.getSpecific = ({ family_id, names }) => {
    let questionmarks = "";

    for(let i = 0; i < names.length; i++) {
        if(i < names.length - 1) questionmarks += "?,";
        else questionmarks += "?";
    }
    
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM Medication WHERE family_id = ? AND name IN (${questionmarks})`, [family_id, ...names], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.decrease = ({ doseMedications }) => {
    let cases = "";
    const ids = [];

    for(let i = 0; i < doseMedications.length; i++) {
        cases += `WHEN ${doseMedications[i].medication_id} THEN ${doseMedications[i].amount_to_take} `;
        ids.push(doseMedications[i].medication_id);
    }

    cases += "END";
    
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Medication SET amount = amount - CASE id ${cases} WHERE id IN (${ids.join(",")})`, [], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;