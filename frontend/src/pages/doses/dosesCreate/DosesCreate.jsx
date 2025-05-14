import React, { useState } from "react";
import "./DosesCreate.css";
import Loading from "../../../components/loading/Loading";
import TimeInputs from "../../../components/timeInputs/TimeInputs";
import { DB } from "../../../functions/DB";
import { CheckInputs } from "../../../functions/CheckInputs";
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
    
    async function handleCreate() {
        const isError = CheckInputs.dose(inputs, setInfo);
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

                    <TimeInputs inputs={inputs} setInputs={setInputs} />

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