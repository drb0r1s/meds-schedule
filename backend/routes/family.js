const express = require("express");
const bcrypt = require("bcryptjs");
const error = require("../functions/error");
const DB = require("../db/index");
const ExtendedDate = require("../functions/ExtendedDate");
const CheckInputs = require("../functions/CheckInputs");

const account = express.Router();

account.post("/login", async (req, res) => {
    const { name, password } = req.body;

    const isError = CheckInputs.account({ name, password }, res, true);
    if(isError) return;

    try {
        const queryResult = await DB.account.get({ name });
        if(!queryResult) return error(res, { message: "Account not found." });

        const isMatch = await bcrypt.compare(password, queryResult.password);
        if(!isMatch) return error(res, { message: "Invalid password." });

        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

account.post("/loggedIn", async (req, res) => {
    const { token } = req.body;

    try {
        const queryResult = await DB.account.loggedIn({ token });
        if(!queryResult) return error(res, { message: "Account not found." });

        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

account.post("/register", async (req, res) => {
    const { name, password, repeatPassword } = req.body;
    
    const isError = CheckInputs.account({ name, password, repeatPassword }, res, false);
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
        const queryResult = await DB.account.register(registerObject);
        if(queryResult.affectedRows) console.log("New row has been inserted in Account table.");
    
        res.status(200).json({ ...registerObject, id: queryResult.insertId });
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

account.post("/update", async (req, res) => {
    const { id, value } = req.body;

    if(value.password && value.repeatPassword === undefined) return error(res, { message: "Repeat password wasn't provided." });

    let updateObject = { updated_at: ExtendedDate.now() };
    const blockKeys = ["repeatPassword"];

    Object.values(value).forEach((prop, index) => {
        const key = Object.keys(value)[index];
        if(blockKeys.indexOf(key) > -1) return;

        if(prop) updateObject = {...updateObject, [key]: prop};
    });

    // !updateObject.password because we want to check if password is equal to confirmation password (which is achieved by checking if password exists, statement returns false, so isLogin = false).
    const isError = CheckInputs.account(updateObject, res, !updateObject.password);
    if(isError) return;

    if(updateObject?.password) {
        const saltRounds = 10; // Hash complexity for the password (based on bcrypt library).
        const hashedPassword = await bcrypt.hash(updateObject.password, saltRounds);

        updateObject.password = hashedPassword;
    }

    try {
        const queryResult = await DB.account.update({ id, updateObject });
        if(queryResult.affectedRows) console.log("Row has been updated in Account table.");

        res.status(200).json(updateObject);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

account.post("/get-schedules", async (req, res) => {
    const { id } = req.body;

    try {
        const queryResult = await DB.account.getSchedules({ id });
        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

account.post("/get-medications", async (req, res) => {
    const { id } = req.body;

    try {
        const queryResult = await DB.account.getMedications({ id });
        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

module.exports = account;