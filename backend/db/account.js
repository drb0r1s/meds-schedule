const connection = require("./connection");

const dataPool = {};

dataPool.get = ({ name }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Account WHERE name = ?", [name], (err, res) => {
            if(err) return reject(err);
            return resolve(res[0]);
        });
    });
}

dataPool.loggedIn = ({ accountId }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Account WHERE id = ?", [accountId], (err, res) => {
            if(err) return reject(err);
            return resolve(res[0]);
        });
    });
}

dataPool.register = ({ name, password, type, admin_password, description, color, created_at, updated_at }) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Account (name, password, type, admin_password, description, color, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)", [name, password, type, admin_password, description, color, created_at, updated_at], (err, res) => {
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
        connection.query(`UPDATE Account ${set} WHERE id = ?`, [...values, id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.getSchedules = ({ id }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Schedule WHERE account_id = ?", [id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.getMedications = ({ id }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Medication WHERE account_id = ?", [id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;