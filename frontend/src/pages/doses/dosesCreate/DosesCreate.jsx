import React, { useState } from "react";
import "./DosesCreate.css";
import Loading from "../../../components/loading/Loading";
import { DB } from "../../../functions/DB";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const DosesCreate = ({ schedule, dosesCreateModalRef, disableDosesCreateModal, setInfo, setDoses }) => {
    const [inputs, setInputs] = useState({ name: "", description: "", medication: [{ name: "", amount: "", amountUnit: "" }], time: { hours: "", minutes: "", day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear() }, color: "" });
    const [numberOfMedications, setNumberOfMedications] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const amountUnits = ["mg", "g", "mcg", "ml", "l", "pills", "capsules", "drops", "patches", "inhalations", "other"];

    function updateNumberOfMedications(key, value, index) {
        const newMedication = [...inputs.medication];
        newMedication[index][key] = value;
        
        const nonEmptyInputs = [];

        for(let i = 0; i < newMedication.length; i++) {
            if(newMedication[i].name) nonEmptyInputs.push(newMedication[i]);
        }

        setInputs({...inputs, medication: [...nonEmptyInputs, { name: "", amount: "", amountUnit: "" }]});
        setNumberOfMedications(nonEmptyInputs.length + 1);
    }

    function checkInputs() {
        if(!inputs.name.length) {
            setInfo({ type: "error", message: "Name field is empty." });
            return true;
        }

        else if(!inputs.time.hours.length) {
            setInfo({ type: "error", message: "Hours field is empty." });
            return true;
        }
        
        else if(!inputs.time.minutes.length) {
            setInfo({ type: "error", message: "Minutes field is empty." });
            return true;
        }

        else if(!inputs.medication[0].name.length) {
            setInfo({ type: "error", message: "Medication field is empty." });
            return true;
        }

        else if(inputs.name.length < 3 || inputs.name.length > 64) {
            setInfo({ type: "error", message: "Name length should be greater than 2 or less than 64!" });
            return true;
        }

        else if(checkMedicationInputs()) {
            setInfo({ type: "error", message: "Medications are invalid." });
            return true;
        }

        else if(isNaN(parseInt(inputs.time.hours)) || isNaN(parseInt(inputs.time.minutes)) || isNaN(parseInt(inputs.time.day)) || isNaN(parseInt(inputs.time.month)) || isNaN(parseInt(inputs.time.year))) {
            setInfo({ type: "error", message: "Time is invalid." });
            return true;
        }

        else if(parseInt(inputs.time.hours) < 0 || parseInt(inputs.time.hours) > 23) {
            setInfo({ type: "error", message: "Hours field is invalid." });
            return true;
        }

        else if(parseInt(inputs.time.minutes) < 0 || parseInt(inputs.time.minutes) > 59) {
            setInfo({ type: "error", message: "Minutes field is invalid." });
            return true;
        }

        else if(parseInt(inputs.time.month) < 1 || parseInt(inputs.time.month) > 12) {
            setInfo({ type: "error", message: "Month is invalid." });
            return true;
        }

        else if(parseInt(inputs.time.day) < 1 || parseInt(inputs.time.day) > 31 || parseInt(inputs.time.day) > ExtendedDate.monthLengths[parseInt(inputs.time.month) - 1]) {
            setInfo({ type: "error", message: "Day is invalid." });
            return true;
        }

        else if(parseInt(inputs.time.year) < new Date().getFullYear() || parseInt(inputs.time.year) > new Date().getFullYear() + 10) {
            setInfo({ type: "error", message: "Year is invalid." });
            return true;
        }

        return false;
    }

    function checkMedicationInputs() {
        for(let i = 0; i < inputs.medication.length - 1; i++) {
            if(
                inputs.medication[i].name.length < 3 ||
                inputs.medication[i].name.length > 64 ||
                isNaN(parseInt(inputs.medication[i].amount)) ||
                parseInt(inputs.medication[i].amount) < 0 ||
                parseInt(inputs.medication[i].amount) > 100000 ||
                amountUnits.indexOf(inputs.medication[i].amountUnit) === -1
            ) return true;
        }

        return false;
    }
    
    async function handleCreate() {
        const isError = checkInputs();
        if(isError) return;

        setIsLoading(true);
        
        // Create a copy of inputs.medication array, but stop the last index, because we don't need empty input.
        const medications = inputs.medication.slice(0, -1);

        const medicationsResult = await DB.medication.checkExistence(schedule.family_id, medications);
        if(medicationsResult.message) setInfo({ type: "error", message: medicationsResult.message });
        
        else {
            const doseResult = await DB.dose.create({ schedule_id: schedule.id, ...inputs });
            if(doseResult.message) return setInfo({ type: "error", message: doseResult.message });

            const doseMedicationResult = await DB.doseMedication.create({ dose_id: doseResult.id, medications: medicationsResult });
            if(doseMedicationResult.message) return setInfo({ type: "error", message: doseMedicationResult.message });

            setInfo({ type: "success", message: `${inputs.name} was successfully added to schedule.` });
            setInputs({ name: "", description: "", medication: [{ name: "", amount: "", amountUnit: "" }], time: { hours: "", minutes: "", day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear() }, color: "" });
            setNumberOfMedications(1);

            disableDosesCreateModal();

            setDoses(prevDoses => [...prevDoses, doseResult]);
        }

        setIsLoading(false);
    }
    
    return(
        <div className="doses-create" ref={dosesCreateModalRef}>
            {isLoading && <Loading />}
            
            <div
                className="x-button"
                onClick={disableDosesCreateModal}
            ><img src={images.xIcon} alt="X" /></div>

            <h2>Add <span>dose</span></h2>

            <div className="form-holder">
                <form>
                    <div className="form-color">
                        <div
                            className="background"
                            style={inputs.color ? { backgroundColor: inputs.color } : {}}
                        >
                            <img src={images.pillIcon} alt="PILL" />
                        </div>
                                        
                        <input
                            type="color"
                            value={inputs.color}
                            onChange={e => setInputs({...inputs, color: e.target.value})}
                        />
                    </div>
                    
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

                    <fieldset className="time-inputs">
                        <div className="time-inputs-first">
                            <input
                                type="number"
                                placeholder="HH"
                                min="0"
                                max="23"
                                minLength="1"
                                maxLength="2"
                                value={inputs.time.hours}
                                onChange={e => setInputs({...inputs, time: {...inputs.time, hours: e.target.value}})}
                            />

                            <span>:</span>

                            <input
                                type="number"
                                placeholder="MM"
                                min="0"
                                max="59"
                                minLength="1"
                                maxLength="2"
                                value={inputs.time.minutes}
                                onChange={e => setInputs({...inputs, time: {...inputs.time, minutes: e.target.value}})}
                            />
                        </div>
                        
                        <div className="time-inputs-second">
                            <input
                                type="number"
                                placeholder="DD"
                                min="1"
                                max="31"
                                minLength="1"
                                maxLength="2"
                                value={inputs.time.day}
                                onChange={e => setInputs({...inputs, time: {...inputs.time, day: e.target.value}})}
                            />

                            <input
                                type="number"
                                placeholder="MM"
                                min="1"
                                max="12"
                                minLength="1"
                                maxLength="2"
                                value={inputs.time.month}
                                onChange={e => setInputs({...inputs, time: {...inputs.time, month: e.target.value}})}
                            />

                            <input
                                type="number"
                                placeholder="YYYY"
                                min="2025"
                                max="2030"
                                minLength="4"
                                maxLength="4"
                                value={inputs.time.year}
                                onChange={e => setInputs({...inputs, time: {...inputs.time, year: e.target.value}})}
                            />
                        </div>
                    </fieldset>

                    <div className="medication-holder">
                        <strong>Medications:</strong>
                        
                        {new Array(numberOfMedications).fill(0).map((medication, index) => {
                            return <fieldset
                                className="medication-inputs"
                                key={index}
                            >
                                <input
                                    type="text"
                                    placeholder="Medication"
                                    minLength="3"
                                    maxLength="64"
                                    value={inputs.medication[index].name}
                                    onChange={e => updateNumberOfMedications("name", e.target.value, index)}
                                />

                                <input
                                    className={!inputs.medication[index].name ? "input-disabled" : ""}
                                    type="number"
                                    placeholder="Amount"
                                    min="1"
                                    max="10"
                                    disabled={!inputs.medication[index].name}
                                    value={inputs.medication[index].amount}
                                    onChange={e => updateNumberOfMedications("amount", e.target.value, index)}
                                />

                                <select
                                    className={!inputs.medication[index].name ? "input-disabled" : ""}
                                    disabled={!inputs.medication[index].name}
                                    value={inputs.medication[index].amountUnit}
                                    onChange={e => updateNumberOfMedications("amountUnit", e.target.value, index)}
                                >
                                    <option value="">Amount Unit</option>

                                    {amountUnits.map((amountUnit, index) => {
                                        return <option
                                            key={index}
                                            value={amountUnit}
                                        >{amountUnit}</option>;
                                    })}
                                </select>
                            </fieldset>;
                        })}
                    </div>
                </form>

                <button
                    className="add-button"
                    onClick={handleCreate}
                >Add</button>
            </div>
        </div>
    );
}

export default DosesCreate;