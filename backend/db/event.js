const connection = require("./connection");

const dataPool = {};

dataPool.create = ({ family_id, schedule_id, dose_id, medication_id, name, description, type, created_at }) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Event (family_id, schedule_id, dose_id, medication_id, name, description, type, created_at) VALUES (?,?,?,?,?,?,?,?)", [family_id, schedule_id, dose_id, medication_id, name, description, type, created_at], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;