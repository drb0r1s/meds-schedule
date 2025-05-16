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

dataPool.update = ({ id, updateObject }) => {
    const values = Object.values(updateObject);
    let set = "SET ";

    Object.keys(updateObject).forEach((key, index) => {
        if(index === values.length - 1) set += `${key} = ?`;
        else set += `${key} = ?, `;
    });
    
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Dose ${set} WHERE id = ?`, [...values, id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.delete = ({ id }) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM Dose WHERE id = ?", [id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.setStatus = ({ dose, status }) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Dose SET status = ? WHERE id = ?", [status, dose.id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.deleteMultiple = ({ ids }) => {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM Dose WHERE id IN (${ids.join(", ")})`, (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;