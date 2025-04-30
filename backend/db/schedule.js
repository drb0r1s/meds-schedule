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

dataPool.create = ({ family_id, name, description, color, created_at, updated_at }) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Schedule (family_id, name, description, color, created_at, updated_at) VALUES (?,?,?,?,?,?)", [family_id, name, description, color, created_at, updated_at], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;