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

dataPool.getAll = ({ family_id }) => {
    const sql = `
        SELECT
            e.id, e.name AS event_name, e.description, e.type, e.created_at,
            f.name AS family_name, f.id AS family_id,
            s.name AS schedule_name, s.id AS schedule_id,
            d.name AS dose_name, d.id AS dose_id,
            m.name AS medication_name, m.id AS medication_id
        FROM Event e
        LEFT JOIN Family f ON e.family_id = f.id
        LEFT JOIN Schedule s ON e.schedule_id = s.id
        LEFT JOIN Dose d ON e.dose_id = d.id
        LEFT JOIN Medication m ON e.medication_id = m.id
        WHERE e.family_id = ?
        ORDER BY e.created_at DESC
    `;

    return new Promise((resolve, reject) => {
        connection.query(sql, [family_id], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = dataPool;