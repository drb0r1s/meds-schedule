import React, { useState } from "react";
import "./Account.css";
import Logo from "../../components/logo/Logo";
import AccountLogin from "./AccountLogin";
import AccountRegister from "./AccountRegister";
import Info from "../../components/Info/Info";
import { DB } from "../../functions/DB";

const Account = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [inputs, setInputs] = useState({ name: "", password: "", repeatPassword: "" });

    async function handleContinue() {
        if(isLogin) {

        }

        else {
            const res = await DB.register(inputs);
            console.log(res)
        }
    }
    
    return(
        <section className="account">
            <Info type="error" message="Not enough something...." />
            
            <div className="logo-holder">
                <Logo />
                <p>{isLogin ? "Log in" : "Register"} to your account</p>
            </div>

            {isLogin ? <>
                <AccountLogin inputs={inputs} setInputs={setInputs} />
                <p>Don't have an account? <button
                    className="panel-button"
                    onClick={() => setIsLogin(false)}
                >Register</button></p>
            </> : <>
                <AccountRegister inputs={inputs} setInputs={setInputs} />
                <p>Already have an account? <button
                    className="panel-button"
                    onClick={() => setIsLogin(true)}
                >Login</button></p>
            </>}

            <button className="continue-button" onClick={handleContinue}>Continue</button>
        </section>
    );
}

export default Account;