const express = require("express");
const bcrypt = require("bcryptjs");
const error = require("../functions/error");
const DB = require("../db/index");
const ExtendedDate = require("../functions/ExtendedDate");
const CheckInputs = require("../functions/CheckInputs");

const family = express.Router();

family.post("/login", async (req, res) => {
    const { name, password } = req.body;

    const isError = CheckInputs.family({ name, password }, res, true);
    if(isError) return;

    try {
        const queryResult = await DB.family.get({ name });
        if(!queryResult) return error(res, { message: "Family not found." });

        const isMatch = await bcrypt.compare(password, queryResult.password);
        if(!isMatch) return error(res, { message: "Invalid password." });

        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

family.post("/loggedIn", async (req, res) => {
    const { token } = req.body;

    try {
        const queryResult = await DB.family.loggedIn({ token });
        if(!queryResult) return error(res, { message: "Family not found." });

        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

family.post("/register", async (req, res) => {
    const { name, password, repeatPassword } = req.body;
    
    const isError = CheckInputs.family({ name, password, repeatPassword }, res, false);
    if(isError.message) return;

    const saltRounds = 10; // Hash complexity for the password (based on bcrypt library).
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const registerObject = {
        name,
        password: hashedPassword,
        description: "",
        color: "",
        created_at: ExtendedDate.now(),
        updated_at: ExtendedDate.now()
    };

    try {
        const queryResult = await DB.family.register(registerObject);
        if(queryResult.affectedRows) console.log("New row has been inserted in Family table.");
    
        res.status(200).json({ ...registerObject, id: queryResult.insertId });
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

family.post("/update", async (req, res) => {
    const { id, value } = req.body;

    if(value.password && value.repeatPassword === undefined) return error(res, { message: "Repeat password wasn't provided." });

    let updateObject = {};
    const blockKeys = ["repeatPassword"];

    Object.values(value).forEach((prop, index) => {
        const key = Object.keys(value)[index];
        if(blockKeys.indexOf(key) > -1) return;

        if(prop) updateObject = {...updateObject, [key]: prop};
    });

    // !updateObject.password because we want to check if password is equal to confirmation password (which is achieved by checking if password exists, statement returns false, so isLogin = false).
    const isError = CheckInputs.family(updateObject, res, !updateObject.password);
    if(isError) return;

    try {
        const queryResult = await DB.family.update({ id, updateObject });
        if(queryResult.affectedRows) console.log("Row has been updated in Family table.");

        res.status(200).json(updateObject);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

family.post("/get-schedules", async (req, res) => {
    const { id } = req.body;

    try {
        const queryResult = await DB.family.getSchedules({ id });
        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

family.post("/get-medications", async (req, res) => {
    const { id } = req.body;

    try {
        const queryResult = await DB.family.getMedications({ id });
        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

module.exports = family;