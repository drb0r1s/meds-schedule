import React, { useState } from "react";
import "./AccountPanel.css";
import Checkbox from "../../components/checkbox/Checkbox";

const AccountRegister = ({ inputs, setInputs }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return(
        <form className="account-panel account-register">
            <fieldset>
                <input
                    type="text"
                    placeholder="Name"
                    value={inputs.name}
                    onChange={e => setInputs(prevInputs => { return {...prevInputs, name: e.target.value} })}
                />
            </fieldset>

            <fieldset>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={inputs.password}
                    onChange={e => setInputs(prevInputs => { return {...prevInputs, password: e.target.value} })}
                />

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={inputs.repeatPassword}
                    onChange={e => setInputs(prevInputs => { return {...prevInputs, repeatPassword: e.target.value} })}
                />

                <Checkbox
                    title="Show password"
                    value={showPassword}
                    setValue={setShowPassword}
                />
            </fieldset>
        </form>
    );
}

export default AccountRegister;