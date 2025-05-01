const familyDataPool = require("./family");
const scheduleDataPool = require("./schedule");
const medicationDataPool = require("./medication");

const dataPool = { family: familyDataPool, schedule: scheduleDataPool, medication: medicationDataPool};

module.exports = dataPool;