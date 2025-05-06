import { ExtendedDate } from "./ExtendedDate";

export const CheckInputs = {
    family: (inputs, setInfo, isLogin) => {
        if(inputs.name !== undefined && !inputs.name.length) {
            setInfo({ type: "error", message: "Name field is empty." });
            return true;
        }

        else if(inputs.password !== undefined && !inputs.password.length) {
            setInfo({ type: "error", message: "Password field is empty." });
            return true;
        }

        else if(inputs.name !== undefined && (inputs.name.length < 3 || inputs.name.length > 64)) {
            setInfo({ type: "error", message: "Name length should be greater than 2 or less than 64!" });
            return true;
        }

        else if(inputs.password !== undefined && (inputs.password.length < 8 || inputs.password.length > 64)) {
            setInfo({ type: "error", message: "Password length should be greater than 7 or less than 64!" });
            return true;
        }
    
        if(!isLogin) {
            if(inputs.repeatPassword !== undefined && !inputs.repeatPassword.length) {
                setInfo({ type: "error", message: "Repeat password field is empty." });
                return true;
            }

            else if(inputs.repeatPassword !== undefined && (inputs.repeatPassword.length < 8 || inputs.repeatPassword.length > 64)) {
                setInfo({ type: "error", message: "Confirmation password length should be greater than 7 or less than 64!" });
                return true;
            }

            else if(inputs.password !== undefined && inputs.repeatPassword !== undefined && (inputs.password !== inputs.repeatPassword)) {
                setInfo({ type: "error", message: "Password and confirmation password don't match!" });
                return true;
            }
        }

        return false;
    },

    schedule: (inputs, setInfo) => {
        if(inputs.name !== undefined && !inputs.name.length) {
            setInfo({ type: "error", message: "Name field is empty." });
            return true;
        }

        else if(inputs.name !== undefined && (inputs.name.length < 3 || inputs.name.length > 64)) {
            setInfo({ type: "error", message: "Name length should be greater than 2 or less than 64!" });
            return true;
        }
    },

    dose: (inputs, setInfo) => {
        if(inputs.name !== undefined && !inputs.name.length) {
            setInfo({ type: "error", message: "Name field is empty." });
            return true;
        }

        else if(inputs.time.hours !== undefined && !inputs.time.hours.length) {
            setInfo({ type: "error", message: "Hours field is empty." });
            return true;
        }
        
        else if(inputs.time.minutes !== undefined && !inputs.time.minutes.length) {
            setInfo({ type: "error", message: "Minutes field is empty." });
            return true;
        }

        else if(!inputs.medication[0].name.length) {
            setInfo({ type: "error", message: "Medication field is empty." });
            return true;
        }

        else if(inputs.name !== undefined && (inputs.name.length < 3 || inputs.name.length > 64)) {
            setInfo({ type: "error", message: "Name length should be greater than 2 or less than 64!" });
            return true;
        }

        else if(checkMedicationInputs()) {
            setInfo({ type: "error", message: "Medications are invalid." });
            return true;
        }

        else if(inputs.time.hours !== undefined && isNaN(parseInt(inputs.time.hours))) {
            setInfo({ type: "error", message: "Hours field is not a number." });
            return true;
        }

        else if(inputs.time.minutes !== undefined && isNaN(parseInt(inputs.time.minutes))) {
            setInfo({ type: "error", message: "Minutes field is not a number." });
            return true;
        }

        else if(inputs.time.day !== undefined && isNaN(parseInt(inputs.time.day))) {
            setInfo({ type: "error", message: "Day field is not a number." });
            return true;
        }

        else if(inputs.time.month !== undefined && isNaN(parseInt(inputs.time.month))) {
            setInfo({ type: "error", message: "Month field is not a number." });
            return true;
        }

        else if(inputs.time.year !== undefined && isNaN(parseInt(inputs.time.year))) {
            setInfo({ type: "error", message: "Year field is not a number." });
            return true;
        }

        else if(inputs.time.hours !== undefined && (parseInt(inputs.time.hours) < 0 || parseInt(inputs.time.hours) > 23)) {
            setInfo({ type: "error", message: "Hours field is invalid." });
            return true;
        }

        else if(inputs.time.minutes !== undefined && (parseInt(inputs.time.minutes) < 0 || parseInt(inputs.time.minutes) > 59)) {
            setInfo({ type: "error", message: "Minutes field is invalid." });
            return true;
        }

        else if(inputs.time.month !== undefined && (parseInt(inputs.time.month) < 1 || parseInt(inputs.time.month) > 12)) {
            setInfo({ type: "error", message: "Month is invalid." });
            return true;
        }

        else if(inputs.time.day !== undefined && inputs.time.month !== undefined && (parseInt(inputs.time.day) < 1 || parseInt(inputs.time.day) > 31 || parseInt(inputs.time.day) > ExtendedDate.monthLengths[parseInt(inputs.time.month) - 1])) {
            setInfo({ type: "error", message: "Day is invalid." });
            return true;
        }

        else if(inputs.time.year !== undefined && (parseInt(inputs.time.year) < new Date().getFullYear() || parseInt(inputs.time.year) > new Date().getFullYear() + 10)) {
            setInfo({ type: "error", message: "Year is invalid." });
            return true;
        }

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

    medication: (inputs, setInfo) => {
        const amountUnits = ["mg", "g", "mcg", "ml", "l", "pills", "capsules", "drops", "patches", "inhalations", "other"];
        
        if(inputs.name !== undefined && !inputs.name.length) {
            setInfo({ type: "error", message: "Name field is empty." });
            return true;
        }

        else if(inputs.substance !== undefined && !inputs.substance.length) {
            setInfo({ type: "error", message: "Substance field is empty." });
            return true;
        }

        else if(inputs.expirationDate.day !== undefined && !inputs.expirationDate.day.length) {
            setInfo({ type: "error", message: "Day field is empty." });
            return true;
        }

        else if(inputs.expirationDate.month !== undefined && !inputs.expirationDate.month.length) {
            setInfo({ type: "error", message: "Month field is empty." });
            return true;
        }

        else if(inputs.expirationDate.year !== undefined && !inputs.expirationDate.year.length) {
            setInfo({ type: "error", message: "Year field is empty." });
            return true;
        }

        else if(inputs.amount !== undefined && !inputs.amount.length) {
            setInfo({ type: "error", message: "Amount field is empty." });
            return true;
        }

        else if(inputs.amountUnit !== undefined && !inputs.amountUnit.length) {
            setInfo({ type: "error", message: "Amount unit field is empty." });
            return true;
        }

        else if(inputs.name !== undefined && (inputs.name.length < 3 || inputs.name.length > 64)) {
            setInfo({ type: "error", message: "Name length should be greater than 2 or less than 64!" });
            return true;
        }

        else if(inputs.substance !== undefined && (inputs.substance.length < 3 || inputs.substance.length > 64)) {
            setInfo({ type: "error", message: "Substance name length should be greater than 2 or less than 64!" });
            return true;
        }

        else if(inputs.expirationDate.day !== undefined && isNaN(parseInt(inputs.expirationDate.day))) {
            setInfo({ type: "error", message: "Expiration date day is invalid." });
            return true;
        }

        else if(inputs.expirationDate.month !== undefined && isNaN(parseInt(inputs.expirationDate.month))) {
            setInfo({ type: "error", message: "Expiration date month is invalid." });
            return true;
        }

        else if(inputs.expirationDate.year !== undefined && isNaN(parseInt(inputs.expirationDate.year))) {
            setInfo({ type: "error", message: "Expiration date year is invalid." });
            return true;
        }

        else if(inputs.expirationDate.month !== undefined && (parseInt(inputs.expirationDate.month) < 1 || parseInt(inputs.expirationDate.month) > 12)) {
            setInfo({ type: "error", message: "Month is invalid." });
            return true;
        }

        else if(inputs.expirationDate.day !== undefined && inputs.expirationDate.month !== undefined && (parseInt(inputs.expirationDate.day) < 1 || parseInt(inputs.expirationDate.day) > 31 || parseInt(inputs.expirationDate.day) > ExtendedDate.monthLengths[parseInt(inputs.expirationDate.month) - 1])) {
            setInfo({ type: "error", message: "Day is invalid." });
            return true;
        }

        else if(inputs.expirationDate.year !== undefined && (parseInt(inputs.expirationDate.year) < new Date().getFullYear() || parseInt(inputs.expirationDate.year) > new Date().getFullYear() + 10)) {
            setInfo({ type: "error", message: "Year is invalid." });
            return true;
        }

        else if(inputs.amount !== undefined && (isNaN(parseInt(inputs.amount)) || parseInt(inputs.amount) <= 0 || parseInt(inputs.amount) > 100000)) {
            setInfo({ type: "error", message: "Amount is invalid." });
            return true;
        }

        else if(inputs.amountUnit !== undefined && (amountUnits.indexOf(inputs.amountUnit) === -1)) {
            setInfo({ type: "error", message: "Amount unit is invalid." });
            return true;
        }

        return false;
    }
};