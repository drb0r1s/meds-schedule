import React, { useState } from "react";
import "./Account.css";
import Logo from "../../components/logo/Logo";
import AccountLogin from "./AccountLogin";
import AccountRegister from "./AccountRegister";
import Info from "../../components/Info/Info";
import Loading from "../../components/loading/Loading";
import { DB } from "../../functions/DB";

const Account = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [inputs, setInputs] = useState({ name: "", password: "", repeatPassword: "" });
    const [info, setInfo] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    function changePanel(login) {
        setIsLogin(login);
        setInputs({ name: "", password: "", repeatPassword: "" });
    }

    function checkInputs() {
        if(!inputs.name.length) {
            setInfo({ type: "error", message: "Name field is empty." });
            return true;
        }

        else if(!inputs.password.length) {
            setInfo({ type: "error", message: "Password field is empty." });
            return true;
        }

        else if(inputs.name.length < 3 || inputs.name.length > 64) {
            setInfo({ type: "error", message: "Name length should be greater than 2 or less than 64!" });
            return true;
        }

        else if(inputs.password.length < 8 || inputs.password.length > 64) {
            setInfo({ type: "error", message: "Password length should be greater than 7 or less than 64!" });
            return true;
        }
    
        if(!isLogin) {
            if(!inputs.repeatPassword.length) {
                setInfo({ type: "error", message: "Repeat password field is empty." });
                return true;
            }

            else if(inputs.repeatPassword.length < 8 || inputs.repeatPassword.length > 64) {
                setInfo({ type: "error", message: "Confirmation password length should be greater than 7 or less than 64!" });
                return true;
            }

            else if(inputs.password !== inputs.repeatPassword) {
                setInfo({ type: "error", message: "Password and confirmation password don't match!" });
                return true;
            }
        }

        return false;
    }

    async function handleContinue() {
        const isError = checkInputs();
        if(isError) return;
        
        if(isLogin) {
            setIsLoading(true);
            const result = await DB.login(inputs);
            setIsLoading(false);

            if(result.message) return setInfo({ type: "error", message: result.message });
        }

        else {
            setIsLoading(true);
            const result = await DB.register(inputs);
            setIsLoading(false);

            if(result.message) return setInfo({ type: "error", message: result.message });
        }
    }
    
    return(
        <section className="account">
            {isLoading && <Loading />}
            
            {info.message && <Info info={info} setInfo={setInfo} />}
            
            <div className="logo-holder">
                <Logo />
                <p>{isLogin ? "Log in" : "Register"} to your account</p>
            </div>

            {isLogin ? <>
                <AccountLogin inputs={inputs} setInputs={setInputs} />
                <p>Don't have an account? <button
                    className="panel-button"
                    onClick={() => changePanel(false)}
                >Register</button></p>
            </> : <>
                <AccountRegister inputs={inputs} setInputs={setInputs} />
                <p>Already have an account? <button
                    className="panel-button"
                    onClick={() => changePanel(true)}
                >Login</button></p>
            </>}

            <button className="continue-button" onClick={handleContinue}>Continue</button>
        </section>
    );
}

export default Account;