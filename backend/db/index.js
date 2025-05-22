const accountDataPool = require("./account");
const scheduleDataPool = require("./schedule");
const doseDataPool = require("./dose");
const medicationDataPool = require("./medication");
const doseMedicationDataPool = require("./doseMedication");
const eventDataPool = require("./event");

const dataPool = {
    account: accountDataPool,
    schedule: scheduleDataPool,
    dose: doseDataPool,
    medication: medicationDataPool,
    doseMedication: doseMedicationDataPool,
    event: eventDataPool
};

module.exports = dataPool;