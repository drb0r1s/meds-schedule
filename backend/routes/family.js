const express = require("express");
const error = require("../functions/error");

const family = express.Router();

family.post("/register", (req, res) => {
    const { name, password, repeatPassword } = req.body;
    
    const isError = checkInputs({ name, password, repeatPassword }, true, res);
    if(isError) return;

    

    res.status(200).json({ message: "Success!" });
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