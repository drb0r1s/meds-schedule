import React, { useState } from "react";
import "./SchedulesInventoryCreate.css";
import Loading from "../../../components/loading/Loading";
import Info from "../../../components/Info/Info";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";

const SchedulesInventoryCreate = ({ family, inventoryCreateModalRef, disableInventoryCreateModal }) => {
    const [inputs, setInputs] = useState({ name: "", description: "", substance: "", expirationDate: { day: "", month: "", year: "" }, amount: "", amountUnit: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState({ type: "", message: "" });

    const amountUnits = ["mg", "g", "mcg", "ml", "l", "pills", "capsules", "drops", "patches", "inhalations", "other"];
    const monthLengths = [31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function isLeapYear(year) {
        return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
    }

    function checkInputs() {
        if(!inputs.name.length) {
            setInfo({ type: "error", message: "Name field is empty." });
            return true;
        }

        else if(!inputs.substance.length) {
            setInfo({ type: "error", message: "Substance field is empty." });
            return true;
        }

        else if(!inputs.expirationDate.day.length) {
            setInfo({ type: "error", message: "Day field is empty." });
            return true;
        }

        else if(!inputs.expirationDate.month.length) {
            setInfo({ type: "error", message: "Month field is empty." });
            return true;
        }

        else if(!inputs.expirationDate.year.length) {
            setInfo({ type: "error", message: "Year field is empty." });
            return true;
        }

        else if(!inputs.amount.length) {
            setInfo({ type: "error", message: "Amount field is empty." });
            return true;
        }

        else if(!inputs.amountUnit.length) {
            setInfo({ type: "error", message: "Amount unit field is empty." });
            return true;
        }

        else if(inputs.name.length < 3 || inputs.name.length > 64) {
            setInfo({ type: "error", message: "Name length should be greater than 2 or less than 64!" });
            return true;
        }

        else if(inputs.substance.length < 3 || inputs.substance.length > 64) {
            setInfo({ type: "error", message: "Substance name length should be greater than 2 or less than 64!" });
            return true;
        }

        else if(isNaN(parseInt(inputs.expirationDate.day)) || isNaN(parseInt(inputs.expirationDate.month)) || isNaN(parseInt(inputs.expirationDate.year))) {
            setInfo({ type: "error", message: "Expiration date is invalid." });
            return true;
        }

        else if(parseInt(inputs.expirationDate.month) < 1 || parseInt(inputs.expirationDate.month) > 12) {
            setInfo({ type: "error", message: "Month is invalid." });
            return true;
        }

        else if(parseInt(inputs.expirationDate.day) < 1 || parseInt(inputs.expirationDate.day) > 31 || parseInt(inputs.expirationDate.day) > monthLengths[parseInt(inputs.expirationDate.month) - 1]) {
            setInfo({ type: "error", message: "Day is invalid." });
            return true;
        }

        else if(parseInt(inputs.expirationDate.year) < new Date().getFullYear() || parseInt(inputs.expirationDate.year) > new Date().getFullYear() + 10) {
            setInfo({ type: "error", message: "Year is invalid." });
            return true;
        }

        else if(isNaN(parseInt(inputs.amount)) || parseInt(inputs.amount) < 0 || parseInt(inputs.amount) > 100000) {
            setInfo({ type: "error", message: "Amount is invalid." });
            return true;
        }

        else if(amountUnits.indexOf(inputs.amountUnit) === -1) {
            setInfo({ type: "error", message: "Amount unit is invalid." });
            return true;
        }

        return false;
    }
    
    async function handleCreate() {
        const isError = checkInputs();
        if(isError) return;

        setIsLoading(true);
        const result = await DB.medication.create({ family_id: family.id, ...inputs });
        setIsLoading(false);

        if(result.message) return setInfo({ type: "error", message: result.message });
        
        setInfo({ type: "success", message: `${inputs.name} was successfully added to inventory.` });
        setInputs({ name: "", description: "", substance: "", expirationDate: { day: "", month: "", year: "" }, amount: "", amountUnit: "" });
        disableInventoryCreateModal();
    }

    return(
        <div className="schedules-inventory-create" ref={inventoryCreateModalRef}>    
            {isLoading && <Loading />}

            {info.message && <Info info={info} setInfo={setInfo} />}
            
            <button
                className="x-button"
                onClick={disableInventoryCreateModal}
            ><img src={images.xIcon} alt="X" /></button>
            
            <h2>Add <span>medication</span></h2>

            <form>
                <fieldset>
                    <input
                        type="text"
                        placeholder="Name"
                        minLength="3"
                        maxLength="64"
                        value={inputs.name}
                        onChange={e => setInputs({...inputs, name: e.target.value})}
                    />
                </fieldset>

                <fieldset>
                    <textarea
                        type="text"
                        placeholder="Description..."
                        maxLength="320"
                        value={inputs.description}
                        onChange={e => setInputs({...inputs, description: e.target.value})}
                    />
                </fieldset>

                <fieldset>
                    <input
                        type="text"
                        placeholder="Substance"
                        minLength="3"
                        maxLength="64"
                        value={inputs.substance}
                        onChange={e => setInputs({...inputs, substance: e.target.value})}
                    />
                </fieldset>

                <fieldset className="expiration-date-inputs">
                    <input
                        type="number"
                        placeholder="DD"
                        min="1"
                        max="31"
                        minLength="1"
                        maxLength="2"
                        value={inputs.expirationDate.day}
                        onChange={e => setInputs({...inputs, expirationDate: {...inputs.expirationDate, day: e.target.value}})}
                    />

                    <input
                        type="number"
                        placeholder="MM"
                        min="1"
                        max="12"
                        minLength="1"
                        maxLength="2"
                        value={inputs.expirationDate.month}
                        onChange={e => setInputs({...inputs, expirationDate: {...inputs.expirationDate, month: e.target.value}})}
                    />

                    <input
                        type="number"
                        placeholder="YYYY"
                        min="2025"
                        max="2030"
                        minLength="4"
                        maxLength="4"
                        value={inputs.expirationDate.year}
                        onChange={e => setInputs({...inputs, expirationDate: {...inputs.expirationDate, year: e.target.value}})}
                    />
                </fieldset>

                <fieldset>
                    <input
                        type="number"
                        placeholder="Amount"
                        min="1"
                        max="10"
                        value={inputs.amount}
                        onChange={e => setInputs({...inputs, amount: e.target.value})}
                    />
                </fieldset>

                <fieldset>
                    <select
                        value={inputs.amountUnit}
                        onChange={e => setInputs({...inputs, amountUnit: e.target.value})}
                    >
                        <option value="">Amount Unit</option>

                        {amountUnits.map((amountUnit, index) => {
                            return <option
                                key={index}
                                value={amountUnit}
                            >{amountUnit}</option>;
                        })}
                    </select>
                </fieldset>
            </form>

            <button
                className="add-button"
                onClick={handleCreate}
            >Add</button>
        </div>
    );
}

export default SchedulesInventoryCreate;