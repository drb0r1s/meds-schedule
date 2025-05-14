import React, { useState } from "react";
import "./SchedulesInventoryCreate.css";
import Loading from "../../../components/loading/Loading";
import ExpirationDateInputs from "../../../components/expirationDateInputs/ExpirationDateInputs";
import AmountInputs from "../../../components/amountInputs/AmountInputs";
import { DB } from "../../../functions/DB";
import { CheckInputs } from "../../../functions/CheckInputs";
import { images } from "../../../data/images";

const SchedulesInventoryCreate = ({ family, inventoryCreateModalRef, disableInventoryCreateModal, setInfo, setMedications }) => {
    const [inputs, setInputs] = useState({ name: "", description: "", substance: "", expirationDate: { day: "", month: "", year: "" }, amount: "", amountUnit: "" });
    const [isLoading, setIsLoading] = useState(false);
    
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

                <ExpirationDateInputs inputs={inputs} setInputs={setInputs} />
                <AmountInputs inputs={inputs} setInputs={setInputs} />
            </form>

            <button
                className="add-button"
                onClick={handleCreate}
            >Add</button>
        </div>
    );
}

export default SchedulesInventoryCreate;