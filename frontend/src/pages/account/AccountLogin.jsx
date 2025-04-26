import React, { useState } from "react";
import "./AccountLogin.css";
import Checkbox from "../../components/checkbox/Checkbox";

const AccountLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return(
        <form className="account-login">
            <fieldset>
                <input
                    type="text"
                    placeholder="Name"
                />
            </fieldset>

            <fieldset>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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