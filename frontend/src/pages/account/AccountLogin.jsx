import React, { useState } from "react";
import "./AccountPanel.css";
import Checkbox from "../../components/checkbox/Checkbox";

const AccountLogin = ({ inputs, setInputs }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return(
        <form className="account-panel account-login">
            <fieldset>
                <input
                    type="text"
                    placeholder="Name"
                    minLength="3"
                    maxLength="64"
                    value={inputs.name}
                    onChange={e => setInputs(prevInputs => { return {...prevInputs, name: e.target.value} })}
                />
            </fieldset>

            <fieldset>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    minLength="8"
                    maxLength="64"
                    value={inputs.password}
                    onChange={e => setInputs(prevInputs => { return {...prevInputs, password: e.target.value} })}
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

export default AccountLogin;