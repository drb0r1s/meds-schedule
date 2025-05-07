import React, { useState } from "react";
import "./Edit.css";
import Loading from "../../components/loading/Loading";
import Info from "../../components/Info/Info";
import Checkbox from "../../components/checkbox/Checkbox";
import { DB } from "../../functions/DB";
import { CheckInputs } from "../../functions/CheckInputs";
import { images } from "../../data/images";

const Edit = ({ type, editModalRef, disableEditModal, values }) => {
    const [inputs, setInputs] = useState(setInitialValues());
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState({ type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);

    function setInitialValues() {
        switch(type) {
            case "Family":
                return {
                    name: values.name,
                    password: "",
                    repeatPassword: "",
                    description: values.description,
                    color: values.color
                };
            default:
        }
    }

    async function handleEdit() {
        switch(type) {
            case "Family":
                let valueInputs = {};

                Object.values(inputs).forEach((prop, index) => {
                    const key = Object.keys(inputs)[index];
                    if(prop) valueInputs = {...valueInputs, [key]: prop};
                });
            
                // Third parameter (isLogin) is false, because we want to check if password and confirmation password are equal, just like while registering.
                if(CheckInputs.family(valueInputs, setInfo, false)) return;

                setIsLoading(true);
                const result = await DB.family.update(values.id, inputs);
                setIsLoading(false);

                if(result.message) {
                    setInfo({ type: "error", message: result.message });
                    return;
                }

                setInfo({ type: "success", message: `Family ${values.name} was updated successfully!` });
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

                <fieldset className="password-input">
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
            </form>

            <button
                className="edit-button"
                onClick={handleEdit}
            >Edit</button>
        </div>
    );
}

export default Edit;