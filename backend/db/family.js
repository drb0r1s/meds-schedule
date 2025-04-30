const connection = require("./connection");

const dataPool = {};

dataPool.get = ({ name }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Family WHERE name = ?", [name], (err, res) => {
            if(err) return reject(err);
            return resolve(res[0]);
        });
    });
}

dataPool.loggedIn = ({ token }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Family WHERE password = ?", [token], (err, res) => {
            if(err) return reject(err);
            return resolve(res[0]);
        });
    });
}

dataPool.register = ({ name, password, description, color, created_at, updated_at }) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Family (name, password, description, color, created_at, updated_at) VALUES (?,?,?,?,?,?)", [name, password, description, color, created_at, updated_at], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.getSchedules = ({ id }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Schedule WHERE family_id = ?", [id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

dataPool.getMedications = ({ id }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Medication WHERE family_id = ?", [id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;