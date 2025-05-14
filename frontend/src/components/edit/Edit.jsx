import React, { useState } from "react";
import "./Edit.css";
import Loading from "../../components/loading/Loading";
import Info from "../../components/Info/Info";
import Checkbox from "../../components/checkbox/Checkbox";
import TimeInputs from "../timeInputs/TimeInputs";
import ExpirationDateInputs from "../expirationDateInputs/ExpirationDateInputs";
import AmountInputs from "../amountInputs/AmountInputs";
import { DB } from "../../functions/DB";
import { ExtendedDate } from "../../functions/ExtendedDate";
import { CheckInputs } from "../../functions/CheckInputs";
import { images } from "../../data/images";

const Edit = ({ type, editModalRef, disableEditModal, values, setForeignInfo }) => {
    const [inputs, setInputs] = useState(setInitialValues());
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState({ type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);

    function setInitialValues() {
        switch(type) {
            case "family":
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
                if(key === valueKey && prop !== valueProp) return nothingChanged = false;
            });
        });

        if(nothingChanged) {
            setInfo({ type: "error", message: "Nothing was updated." });
            return;
        }
        
        switch(type) {
            case "family":
                // Third parameter (isLogin) is false, because we want to check if password and confirmation password are equal, just like while registering.
                if(CheckInputs.family(valueInputs, setInfo, false)) return;

                setIsLoading(true);
                const familyResult = await DB.family.update(values.id, inputs);
                setIsLoading(false);

                if(familyResult.message) {
                    setInfo({ type: "error", message: familyResult.message });
                    return;
                }

                setForeignInfo({ type: "success", message: `Family ${values.name} was updated successfully!` });
                disableEditModal();

                break;
            case "schedule":
                if(CheckInputs.schedule(valueInputs, setInfo)) return;

                setIsLoading(true);
                const scheduleResult = await DB.schedule.update(values.id, inputs);
                setIsLoading(false);

                if(scheduleResult.message) {
                    setInfo({ type: "error", message: scheduleResult.message });
                    return;
                }

                setForeignInfo({ type: "success", message: `Schedule ${values.name} was updated successfully!` });
                disableEditModal();

                break;
            case "dose":
                if(CheckInputs.dose(valueInputs, setInfo)) return;

                setIsLoading(true);
                const doseResult = await DB.dose.update(values.id, inputs);
                setIsLoading(false);

                if(doseResult.message) {
                    setInfo({ type: "error", message: doseResult.message });
                    return;
                }

                setForeignInfo({ type: "success", message: `Dose ${values.name} was updated successfully!` });
                disableEditModal();

                break;
            case "medication":
                if(CheckInputs.medication(valueInputs, setInfo)) return;

                setIsLoading(true);
                const medicationResult = await DB.medication.update(values.id, inputs);
                setIsLoading(false);

                if(medicationResult.message) {
                    setInfo({ type: "error", message: medicationResult.message });
                    return;
                }

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
                    <input
                        type="text"
                        placeholder="Name"
                        minLength="3"
                        maxLength="64"
                        value={inputs.name}
                        onChange={e => setInputs({...inputs, name: e.target.value})}
                    />
                </fieldset>

                {type === "family" && <fieldset className="password-input">
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