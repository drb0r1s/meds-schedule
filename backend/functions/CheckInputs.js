const error = require("./error");
const ExtendedDate = require("./ExtendedDate");

const CheckInputs = {
    account: (inputs, res, isLogin) => {
        if(inputs.name !== undefined && !inputs.name.length) return error(res, { message: "Name field is empty." });
        else if(inputs.password !== undefined && !inputs.password.length) return error(res, { message: "Password field is empty." });
        else if(inputs.name !== undefined && (inputs.name.length < 3 || inputs.name.length > 64)) return error(res, { message: "Name length should be greater than 2 or less than 64!" });
        else if(inputs.password !== undefined && (inputs.password.length < 8 || inputs.password.length > 64)) return error(res, { message: "Password length should be greater than 7 or less than 64!" });
        
        if(!isLogin) {
            if(inputs.repeatPassword !== undefined && !inputs.repeatPassword.length) return error(res, { message: "Repeat password field is empty." });
            else if(inputs.repeatPassword !== undefined && (inputs.repeatPassword.length < 8 || inputs.repeatPassword.length > 64)) return error(res, { message: "Confirmation password length should be greater than 7 or less than 64!" });
            else if(inputs.password !== undefined && inputs.repeatPassword !== undefined && (inputs.password !== inputs.repeatPassword)) return error(res, { message: "Password and confirmation password don't match!" });
            else if(inputs.type !== undefined && ["individual", "family"].indexOf(inputs.type) === -1) return error(res, { message: "Account type is invalid." });
            
            if(inputs.type !== undefined && inputs.type === "family") {
                if(inputs.adminPassword !== undefined && !inputs.adminPassword.length) return error(res, { message: "Admin password field is empty." });
                else if(inputs.adminPassword !== undefined && (inputs.adminPassword.length < 8 || inputs.adminPassword.length > 64)) return error(res, { message: "Admin password length should be greater than 7 or less than 64!" });
            }
        }

        return false;
    },

    admin: (inputs, res) => {
        if(inputs.adminPassword !== undefined && !inputs.adminPassword.length) return error(res, { message: "Admin password field is empty." });
        else if(inputs.adminPassword !== undefined && (inputs.adminPassword.length < 8 || inputs.adminPassword.length > 64)) return error(res, { message: "Admin password length should be greater than 7 or less than 64!" });
    
        return false;
    },

    schedule: (inputs, res) => {
        if(inputs.name !== undefined && !inputs.name.length) return error(res, { message: "Name field is empty." });
        else if(inputs.name !== undefined && (inputs.name.length < 3 || inputs.name.length > 64)) return error(res, { message: "Name length should be greater than 2 or less than 64!" });

        return false;
    },

    dose: (inputs, res) => {
        if(inputs.name !== undefined && !inputs.name.length) return error(res, { message: "Name field is empty." });
        else if(inputs.name !== undefined && (inputs.name.length < 3 || inputs.name.length > 64)) return error(res, { message: "Name length should be greater than 2 or less than 64!" });
        else if(inputs.medication !== undefined && checkMedicationInputs()) return error(res, { message: "Medications are invalid." });
        else if(inputs.time.hours !== undefined && isNaN(parseInt(inputs.time.hours))) return error(res, { message: "Hours field is invalid." });
        else if(inputs.time.minutes !== undefined && isNaN(parseInt(inputs.time.minutes))) return error(res, { message: "Minutes field is invalid." });
        else if(inputs.time.day !== undefined && isNaN(parseInt(inputs.time.day))) return error(res, { message: "Day field is invalid." });
        else if(inputs.time.month !== undefined && isNaN(parseInt(inputs.time.month))) return error(res, { message: "Month field is invalid." });
        else if(inputs.time.year !== undefined && isNaN(parseInt(inputs.time.year))) return error(res, { message: "Year field is invalid." });
        else if(inputs.time.hours !== undefined && (parseInt(inputs.time.hours) < 0 || parseInt(inputs.time.hours) > 23)) return error(res, { message: "Hours field is invalid." });
        else if(inputs.time.minutes !== undefined && (parseInt(inputs.time.minutes) < 0 || parseInt(inputs.time.minutes) > 59)) return error(res, { message: "Minutes field is invalid." });
        else if(inputs.time.month !== undefined && (parseInt(inputs.time.month) < 1 || parseInt(inputs.time.month) > 12)) return error(res, { message: "Month is invalid." });
        else if(inputs.time.day !== undefined && inputs.time.month !== undefined && (parseInt(inputs.time.day) < 1 || parseInt(inputs.time.day) > 31 || parseInt(inputs.time.day) > ExtendedDate.monthLengths[parseInt(inputs.time.month) - 1])) return error(res, { message: "Day is invalid." });
        else if(inputs.time.year !== undefined && (parseInt(inputs.time.year) < new Date().getFullYear() || parseInt(inputs.time.year) > new Date().getFullYear() + 10)) return error(res, { message: "Year is invalid." });

        return false;

        function checkMedicationInputs() {
            const amountUnits = ["mg", "g", "mcg", "ml", "l", "pills", "capsules", "drops", "patches", "inhalations", "other"];
            
            for(let i = 0; i < inputs.medication.length - 1; i++) {
                if(
                    inputs.medication[i].name.length < 3 ||
                    inputs.medication[i].name.length > 64 ||
                    isNaN(parseInt(inputs.medication[i].amount)) ||
                    parseInt(inputs.medication[i].amount) <= 0 ||
                    parseInt(inputs.medication[i].amount) > 100000 ||
                    amountUnits.indexOf(inputs.medication[i].amountUnit) === -1
                ) return true;
            }

            return false;
        }
    },

    medication: (inputs, res) => {
        const amountUnits = ["mg", "g", "mcg", "ml", "l", "pills", "capsules", "drops", "patches", "inhalations", "other"];
        
        if(inputs.name !== undefined && !inputs.name.length) return error(res, { message: "Name field is empty." });
        else if(inputs.substance !== undefined && !inputs.substance.length) return error(res, { message: "Substance field is empty." });
        else if(inputs.name !== undefined && (inputs.name.length < 3 || inputs.name.length > 64)) return error(res, { message: "Name length should be greater than 2 or less than 64!" });
        else if(inputs.substance !== undefined && (inputs.substance.length < 3 || inputs.substance.length > 64)) return error(res, { message: "Substance name length should be greater than 2 or less than 64!" });
        else if(inputs.expirationDate.day !== undefined && isNaN(parseInt(inputs.expirationDate.day))) return error(res, { message: "Expiration date day is invalid." });
        else if(inputs.expirationDate.month !== undefined && isNaN(parseInt(inputs.expirationDate.month))) return error(res, { message: "Expiration date month is invalid." });
        else if(inputs.expirationDate.year !== undefined && isNaN(parseInt(inputs.expirationDate.year))) return error(res, { message: "Expiration date year is invalid." });
        else if(inputs.expirationDate.month !== undefined && (parseInt(inputs.expirationDate.month) < 1 || parseInt(inputs.expirationDate.month) > 12)) return error(res, { message: "Month is invalid." });
        else if(inputs.expirationDate.day !== undefined && inputs.expirationDate.month !== undefined && (parseInt(inputs.expirationDate.day) < 1 || parseInt(inputs.expirationDate.day) > 31 || parseInt(inputs.expirationDate.day) > ExtendedDate.monthLengths[parseInt(inputs.expirationDate.month) - 1])) return error(res, { message: "Day is invalid." });
        else if(inputs.expirationDate.year !== undefined && (parseInt(inputs.expirationDate.year) < new Date().getFullYear() || parseInt(inputs.expirationDate.year) > new Date().getFullYear() + 10)) return error(res, { message: "Year is invalid." });
        else if(inputs.amount !== undefined && (isNaN(parseInt(inputs.amount)) || parseInt(inputs.amount) <= 0 || parseInt(inputs.amount) > 100000)) return error(res, { message: "Amount is invalid." });
        else if(inputs.amountUnit !== undefined && (amountUnits.indexOf(inputs.amountUnit) === -1)) return error(res, { message: "Amount unit is invalid." });

        return false;
    }
};

module.exports = CheckInputs;