import React, { useState, useEffect, useRef } from "react";
import "./Edit.css";
import Loading from "../../components/loading/Loading";
import Info from "../../components/Info/Info";
import Checkbox from "../../components/checkbox/Checkbox";
import Autocomplete from "../autocomplete/Autocomplete";
import TimeInputs from "../timeInputs/TimeInputs";
import ExpirationDateInputs from "../expirationDateInputs/ExpirationDateInputs";
import AmountInputs from "../amountInputs/AmountInputs";
import { DB } from "../../functions/DB";
import { ExtendedDate } from "../../functions/ExtendedDate";
import { ExtendedString } from "../../functions/ExtendedString";
import { CheckInputs } from "../../functions/CheckInputs";
import { images } from "../../data/images";

const Edit = ({ type, editModalRef, disableEditModal, values, setValues, setForeignInfo, accountId }) => {
    const [inputs, setInputs] = useState(setInitialValues());
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState({ type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isAutocompleteActive, setIsAutocompleteActive] = useState(false);
    
    const autocompleteRef = useRef(null);
    
    useEffect(() => {
        if(isAutocompleteActive) setTimeout(() => { autocompleteRef.current.id = "autocomplete-active" }, 10);
    }, [isAutocompleteActive]);
    
    function disableAutocomplete() {
        if(!autocompleteRef.current) return;

        autocompleteRef.current.id = "";
        setTimeout(() => setIsAutocompleteActive(false), 300);
    }

    function setInitialValues() {
        switch(type) {
            case "account":
                return {
                    name: values.name,
                    password: "",
                    repeatPassword: "",
                    description: values.description,
                    color: values.color
                };

            case "schedule":
                return {
                    name: values.name,
                    description: values.description,
                    color: values.color
                };

            case "dose":
                const parsedTime = ExtendedDate.parseTime(values.time);
            
                return {
                    name: values.name,
                    description: values.description,
                    time: { hours: ExtendedDate.leadingZero(parsedTime.hours), minutes: ExtendedDate.leadingZero(parsedTime.minutes), day: ExtendedDate.leadingZero(parsedTime.day), month: ExtendedDate.leadingZero(parsedTime.month), year: parsedTime.year },
                    color: values.color
                };

            case "medication":
                const parsedExpirationDate = ExtendedDate.parseTime(values.expiration_date);

                return {
                    name: values.name,
                    description: values.description,
                    substance: values.substance,
                    expirationDate: { day: ExtendedDate.leadingZero(parsedExpirationDate.day), month: ExtendedDate.leadingZero(parsedExpirationDate.month), year: parsedExpirationDate.year },
                    amount: values.amount,
                    amountUnit: values.amount_unit
                };

            default:
        }
    }

    async function handleEdit() {
        let valueInputs = {};

        Object.values(inputs).forEach((prop, index) => {
            const key = Object.keys(inputs)[index];
            if(prop) valueInputs = {...valueInputs, [key]: prop};
        });

        let nothingChanged = true;
                
        Object.keys(values).forEach((key, index) => {
            const prop = Object.values(values)[index];

            Object.keys(valueInputs).forEach((valueKey, valueIndex) => {
                const valueProp = Object.values(valueInputs)[valueIndex];
                
                // For nested objects that contains inputs ("time" and "expirationDate") we need to check inner input values.
                // We need to convert key to camelCase (e.g. expiration_date => expirationDate), otherwise property won't be checked.
                if(ExtendedString.toCamelCase(key) === valueKey && typeof valueProp === "object") {
                    let innerNothingChanged = true;

                    Object.keys(valueProp).forEach((innerKey, innerIndex) => {
                        const innerProp = parseInt(Object.values(valueProp)[innerIndex]);
                        const parsedTime = ExtendedDate.parseTime(prop);

                        if(
                            (innerKey === "hours" && innerProp !== parsedTime.hours) ||
                            (innerKey === "minutes" && innerProp !== parsedTime.minutes) ||
                            (innerKey === "day" && innerProp !== parsedTime.day) ||
                            (innerKey === "month" && innerProp !== parsedTime.month) ||
                            (innerKey === "year" && innerProp !== parsedTime.year)
                        ) return innerNothingChanged = false;
                    });

                    if(!innerNothingChanged) return nothingChanged = false;
                }

                // We need to convert key to camelCase (e.g. expiration_date => expirationDate), otherwise property won't be checked.
                else if(ExtendedString.toCamelCase(key) === valueKey && prop !== valueProp) return nothingChanged = false;
            });
        });

        if(nothingChanged) {
            setInfo({ type: "error", message: "Nothing was updated." });
            return;
        }
        
        switch(type) {
            case "account":
                // Third parameter (isLogin) is false, because we want to check if password and confirmation password are equal, just like while registering.
                if(CheckInputs.account(valueInputs, setInfo, false)) return;

                setIsLoading(true);
                
                const accountResult = await DB.account.update(values.id, inputs);
                
                if(accountResult.message) {
                    setIsLoading(false);
                    setInfo({ type: "error", message: accountResult.message });

                    return;
                }

                const eventAccountResult = await DB.event.create({
                    account_id: values.id,
                    schedule_id: null,
                    dose_id: null,
                    medication_id: null,
                    name: "Account Edited",
                    description: "Account was edited.",
                    type: "account"
                });
                
                setIsLoading(false);

                if(eventAccountResult.message) {
                    setInfo({ type: "error", message: eventAccountResult.message });
                    return;
                }

                const newValuesAccount = {...values, ...accountResult};

                setValues(newValuesAccount);
                setForeignInfo({ type: "success", message: `Account ${newValuesAccount.name} was updated successfully!` });
                
                disableEditModal();

                break;
            case "schedule":
                if(CheckInputs.schedule(valueInputs, setInfo)) return;

                setIsLoading(true);
                
                const scheduleResult = await DB.schedule.update(values.id, inputs);
                
                if(scheduleResult.message) {
                    setIsLoading(false);
                    setInfo({ type: "error", message: scheduleResult.message });
                    
                    return;
                }

                const eventResult = await DB.event.create({
                    account_id: values.account_id,
                    schedule_id: values.id,
                    dose_id: null,
                    medication_id: null,
                    name: "Schedule Edited",
                    description: "{event.schedule_name} was edited.",
                    type: "schedule"
                });
                
                setIsLoading(false);

                if(eventResult.message) {
                    setInfo({ type: "error", message: eventResult.message });
                    return;
                }

                const newValuesSchedule = {...values, ...scheduleResult};

                setValues(newValuesSchedule);
                setForeignInfo({ type: "success", message: `Schedule ${newValuesSchedule.name} was updated successfully!` });
                
                disableEditModal();

                break;
            case "dose":
                if(CheckInputs.dose(valueInputs, setInfo)) return;

                setIsLoading(true);

                const doseResult = await DB.dose.update(values.id, inputs);
                
                if(doseResult.message) {
                    setIsLoading(false);
                    setInfo({ type: "error", message: doseResult.message });

                    return;
                }

                const eventDoseResult = await DB.event.create({
                    account_id: accountId,
                    schedule_id: doseResult.schedule_id,
                    dose_id: values.id,
                    medication_id: null,
                    name: "Dose Edited",
                    description: "{event.dose_name} was edited.",
                    type: "dose"
                });
                
                setIsLoading(false);

                if(eventDoseResult.message) {
                    setInfo({ type: "error", message: eventDoseResult.message });
                    return;
                }

                const newValuesDose = {...values, ...doseResult};

                setValues(newValuesDose);
                setForeignInfo({ type: "success", message: `Dose ${newValuesDose.name} was updated successfully!` });
                
                disableEditModal();

                break;
            case "medication":
                if(CheckInputs.medication(valueInputs, setInfo)) return;

                setIsLoading(true);
                
                const medicationResult = await DB.medication.update(values.id, inputs);
                
                if(medicationResult.message) {
                    setIsLoading(false);
                    setInfo({ type: "error", message: medicationResult.message });
                    
                    return;
                }

                const eventMedicationResult = await DB.event.create({
                    account_id: values.account_id,
                    schedule_id: null,
                    dose_id: null,
                    medication_id: values.id,
                    name: "Medication Edited",
                    description: "{event.medication_name} was edited.",
                    type: "medication"
                });
                
                setIsLoading(false);

                if(eventMedicationResult.message) {
                    setInfo({ type: "error", message: eventMedicationResult.result });
                    return;
                }

                const newValuesMedication = {...values, ...medicationResult};

                setValues(newValuesMedication);
                setForeignInfo({ type: "success", message: `Medication ${values.name} was updated successfully!` });
                
                disableEditModal();
            default:
        }
    }
    
    return(
        <div className="edit" ref={editModalRef}>
            {isLoading && <Loading />}
            {info.message && <Info info={info} setInfo={setInfo} />}
            
            <div
                className="x-button"
                onClick={disableEditModal}
            ><img src={images.xIcon} alt="X" /></div>

            <h2>Edit <span>{type}</span></h2>

            <form>
                {type !== "medication" && <div className="form-color">
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
                </div>}

                <fieldset>
                    {type === "medication" && isAutocompleteActive && <Autocomplete
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
                    />
                </fieldset>

                {type === "account" && <fieldset className="password-input">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        minLength="8"
                        maxLength="64"
                        value={inputs.password}
                        onChange={e => setInputs({...inputs, password: e.target.value})}
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Repeat password"
                        minLength="8"
                        maxLength="64"
                        value={inputs.repeatPassword}
                        onChange={e => setInputs({...inputs, repeatPassword: e.target.value})}
                    />

                    <Checkbox
                        title="Show password"
                        value={showPassword}
                        setValue={setShowPassword}
                    />
                </fieldset>}

                <fieldset>
                    <textarea
                        type="text"
                        placeholder="Description..."
                        maxLength="320"
                        value={inputs.description}
                        onChange={e => setInputs({...inputs, description: e.target.value})}
                    />
                </fieldset>

                {type === "dose" && <TimeInputs inputs={inputs} setInputs={setInputs} />}

                {type === "medication" && <>
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
                </>}
            </form>

            <button
                className="edit-button"
                onClick={handleEdit}
            >Edit</button>
        </div>
    );
}

export default Edit;