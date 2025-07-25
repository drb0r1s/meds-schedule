import React, { useState, useRef } from "react";
import "./SchedulesInventoryCreate.css";
import Loading from "../../../components/loading/Loading";
import ExpirationDateInputs from "../../../components/expirationDateInputs/ExpirationDateInputs";
import AmountInputs from "../../../components/amountInputs/AmountInputs";
import Autocomplete from "../../../components/autocomplete/Autocomplete";
import { DB } from "../../../functions/DB";
import { CheckInputs } from "../../../functions/CheckInputs";
import { images } from "../../../data/images";

const SchedulesInventoryCreate = ({ account, inventoryCreateModalRef, disableInventoryCreateModal, setInfo, setMedications }) => {
    const [inputs, setInputs] = useState({ name: "", description: "", substance: "", expirationDate: { day: "", month: "", year: "" }, amount: "", amountUnit: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isAutocompleteActive, setIsAutocompleteActive] = useState(false);

    const autocompleteRef = useRef(null);

    function disableAutocomplete() {
        if(!autocompleteRef.current) return;
        
        autocompleteRef.current.id = ""
        setTimeout(() => setIsAutocompleteActive(false), 300);
    }
    
    async function handleCreate() {
        const isError = CheckInputs.medication(inputs, setInfo);
        if(isError) return;

        setIsLoading(true);
        
        const medicationResult = await DB.medication.create({ account_id: account.id, ...inputs });
        
        if(medicationResult === null || medicationResult === undefined) return;

        if(medicationResult.message) {
            setIsLoading(false);
            setInfo({ type: "error", message: medicationResult.message });

            return;
        }

        const eventResult = await DB.event.create({
            account_id: account.id,
            schedule_id: null,
            dose_id: null,
            medication_id: medicationResult.id,
            name: "Medication Created",
            description: "{event.medication_name} was created.",
            type: "medication"
        });

        setIsLoading(false);

        if(eventResult === null || eventResult === undefined) return;

        if(eventResult.message) {
            setInfo({ type: "error", message: eventResult.message });
            return;
        }
        
        setInfo({ type: "success", message: `${inputs.name} was successfully added to inventory.` });
        setInputs({ name: "", description: "", substance: "", expirationDate: { day: "", month: "", year: "" }, amount: "", amountUnit: "" });
        disableInventoryCreateModal();

        setMedications(prevMedications => [...prevMedications, medicationResult]);
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
                    {isAutocompleteActive && <Autocomplete
                        isAutocompleteActive={isAutocompleteActive}
                        autocompleteRef={autocompleteRef}
                        input={inputs.name}
                        disableAutocomplete={disableAutocomplete}
                        onSelect={selectedMedication => setInputs({
                            ...inputs,
                            name: selectedMedication.name,
                            substance: selectedMedication.substance
                        })}
                    />}

                    <input
                        type="text"
                        placeholder="Name"
                        minLength="3"
                        maxLength="64"
                        value={inputs.name}
                        onChange={e => {
                            setInputs({...inputs, name: e.target.value});

                            if(e.target.value) setIsAutocompleteActive(true);
                            else disableAutocomplete();
                        }}
                        onBlur={disableAutocomplete}
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