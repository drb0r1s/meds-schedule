const connection = require("./connection");

const dataPool = {};

dataPool.create = ({ schedule_id, name, description, time, status, color, created_at, updated_at }) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Dose (schedule_id, name, description, time, status, color, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)", [schedule_id, name, description, time, status, color, created_at, updated_at], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.setStatusTaken = ({ values }) => {
    const ids = [];
    for(let i = 0; i < values.length; i++) ids.push(values.dose_id);

    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Dose SET status = 'taken' WHERE id IN (${ids.join(",")})`, [], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;