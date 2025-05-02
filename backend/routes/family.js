const express = require("express");
const bcrypt = require("bcryptjs");
const error = require("../functions/error");
const DB = require("../db/index");
const ExtendedDate = require("../functions/ExtendedDate");

const family = express.Router();

family.post("/login", async (req, res) => {
    const { name, password } = req.body;

    const isError = checkInputs({ name, password }, true, res);
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
    
    const isError = checkInputs({ name, password, repeatPassword }, false, res);
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

family.post("/getSchedules", async (req, res) => {
    const { id } = req.body;

    try {
        const queryResult = await DB.family.getSchedules({ id });
        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

family.post("/getMedications", async (req, res) => {
    const { id } = req.body;

    try {
        const queryResult = await DB.family.getMedications({ id });
        res.status(200).json(queryResult);
    } catch(err) {
        console.error(`BACKEND ERROR: ${err}`);
        return error(res, { message: err.sqlMessage });
    }
});

function checkInputs(inputs, isLogin, res) {
    if(!inputs.name.length) return error(res, { message: "Name field is empty." });
    else if(!inputs.password.length) return error(res, { message: "Password field is empty." });
    else if(inputs.name.length < 3 || inputs.name.length > 64) return error(res, { message: "Name length should be greater than 2 or less than 64!" });
    else if(inputs.password.length < 8 || inputs.password.length > 64) return error(res, { message: "Password length should be greater than 7 or less than 64!" });
    
    if(!isLogin) {
        if(!inputs.repeatPassword.length) return error(res, { message: "Repeat password field is empty." });
        else if(inputs.repeatPassword.length < 8 || inputs.repeatPassword.length > 64) return error(res, { message: "Confirmation password length should be greater than 7 or less than 64!" });
        else if(inputs.password !== inputs.repeatPassword) return error(res, { message: "Password and confirmation password don't match!" });
    }

    return false;
}

module.exports = family;