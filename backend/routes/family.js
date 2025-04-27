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
        family = await DB.getFamily({ name });
        if(!family) return error(res, { message: "Family not found." });

        const isMatch = bcrypt.compare(password, family.password);
        if(!isMatch) return error(res, { message: "Invalid password." });

        res.status(200).json({ message: "Login successful!" });
        return family;
    } catch(err) {
        console.log(`DB ERROR: ${err}`);
        res.sendStatus(500);

        return error(res, { message: family.sqlMessage });
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
        const queryResult = await DB.register(registerObject);
        if(queryResult.affectedRows) console.log("New row has been inserted in Family table.");
    
        res.status(200).json({ message: "Register successful!" });
        return { success: true };
    } catch(err) {
        console.error(`DB ERROR: ${err}`);
        res.sendStatus(500);

        return error(res, { message: queryResult.sqlMessage });
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