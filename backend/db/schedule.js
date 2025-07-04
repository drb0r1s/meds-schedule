const connection = require("./connection");

const dataPool = {};

dataPool.get = ({ id }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Schedule WHERE id = ?", [id], (err, res) => {
            if(err) return reject(err);
            return resolve(res[0]);
        });
    });
}

dataPool.create = ({ account_id, name, description, color, created_at, updated_at }) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Schedule (account_id, name, description, color, created_at, updated_at) VALUES (?,?,?,?,?,?)", [account_id, name, description, color, created_at, updated_at], (err, res) => {
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
        connection.query(`UPDATE Schedule ${set} WHERE id = ?`, [...values, id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.delete = ({ id }) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM Schedule WHERE id = ?", [id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.getDoses = ({ id }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Dose WHERE schedule_id = ?", [id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;