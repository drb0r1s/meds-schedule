const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect(err => {
    if(err) console.error(`DB ERROR: ${err.message}`);
    else console.log(`DB: Connection established!`);
});

const dataPool = {};

dataPool.getFamily = ({ name }) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Family WHERE name = ?", [name], (err, res) => {
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

module.exports = dataPool;