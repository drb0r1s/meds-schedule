const familyDataPool = require("./family");
const scheduleDataPool = require("./schedule");
const doseDataPool = require("./dose");
const medicationDataPool = require("./medication");

const dataPool = {
    family: familyDataPool,
    schedule: scheduleDataPool,
    dose: doseDataPool,
    medication: medicationDataPool
};

module.exports = dataPool;