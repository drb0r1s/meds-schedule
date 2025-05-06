import React, { useState } from "react";
import "./SchedulesInventoryCreate.css";
import Loading from "../../../components/loading/Loading";
import { DB } from "../../../functions/DB";
import { CheckInputs } from "../../../functions/CheckInputs";
import { images } from "../../../data/images";

const SchedulesInventoryCreate = ({ family, inventoryCreateModalRef, disableInventoryCreateModal, setInfo, setMedications }) => {
    const [inputs, setInputs] = useState({ name: "", description: "", substance: "", expirationDate: { day: "", month: "", year: "" }, amount: "", amountUnit: "" });
    const [isLoading, setIsLoading] = useState(false);

    const amountUnits = ["mg", "g", "mcg", "ml", "l", "pills", "capsules", "drops", "patches", "inhalations", "other"];
    
    async function handleCreate() {
        const isError = CheckInputs.medication(inputs, setInfo);
        if(isError) return;

        setIsLoading(true);
        const result = await DB.medication.create({ family_id: family.id, ...inputs });
        setIsLoading(false);

        if(result.message) return setInfo({ type: "error", message: result.message });
        
        setInfo({ type: "success", message: `${inputs.name} was successfully added to inventory.` });
        setInputs({ name: "", description: "", substance: "", expirationDate: { day: "", month: "", year: "" }, amount: "", amountUnit: "" });
        disableInventoryCreateModal();

        setMedications(prevMedications => [...prevMedications, result]);
    }

    return(
        <div className="schedules-inventory-create" ref={inventoryCreateModalRef}>    
            {isLoading && <Loading />}
            
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