import React, { useState } from "react";
import "./AccountPanel.css";
import Checkbox from "../../components/checkbox/Checkbox";

const AccountRegister = ({ inputs, setInputs }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [accountType, setAccountType] = useState("individual");
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    
    return(
        <form className="account-panel account-register">
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

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    minLength="8"
                    maxLength="64"
                    value={inputs.repeatPassword}
                    onChange={e => setInputs(prevInputs => { return {...prevInputs, repeatPassword: e.target.value} })}
                />

                <Checkbox
                    title="Show password"
                    value={showPassword}
                    setValue={setShowPassword}
                    isChecked={showPassword}
                />
            </fieldset>

            <fieldset className="account-type">
                <p>Account type:</p>

                <div className="account-type-checkboxes">
                    <Checkbox
                        title="Individual"
                        value={accountType}
                        isChecked={accountType === "individual"}
                        onCheck={() => setAccountType("individual")}
                    />

                    <Checkbox
                        title="Family"
                        value={accountType}
                        isChecked={accountType === "family"}
                        onCheck={() => setAccountType("family")}
                    />
                </div>
            </fieldset>

            {accountType === "family" && <fieldset>
                <input
                    type={showAdminPassword ? "text" : "password"}
                    placeholder="Admin password"
                    minLength="8"
                    maxLength="64"
                    value={inputs.adminPassword}
                    onChange={e => setInputs(prevInputs => { return {...prevInputs, adminPassword: e.target.value} })}
                />

                <Checkbox
                    title="Show admin password"
                    value={showAdminPassword}
                    setValue={setShowAdminPassword}
                    isChecked={showAdminPassword}
                />
            </fieldset>}
        </form>
    );
}

export default AccountRegister;