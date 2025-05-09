import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";
import Logo from "../../components/logo/Logo";
import AccountLogin from "./AccountLogin";
import AccountRegister from "./AccountRegister";
import Info from "../../components/Info/Info";
import Loading from "../../components/loading/Loading";
import { DB } from "../../functions/DB";
import { CheckInputs } from "../../functions/CheckInputs";

const Account = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [inputs, setInputs] = useState({ name: "", password: "", repeatPassword: "" });
    const [info, setInfo] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    function changePanel(login) {
        setIsLogin(login);
        setInputs({ name: "", password: "", repeatPassword: "" });
    }

    async function handleContinue() {
        const isError = CheckInputs.family(inputs, setInfo, isLogin);
        if(isError) return;
        
        if(isLogin) {
            setIsLoading(true);
            const result = await DB.family.login(inputs);
            setIsLoading(false);

            if(result.message) return setInfo({ type: "error", message: result.message });
            
            else {
                localStorage.setItem("token", result.password);
                navigate("/schedules");
            }
        }

        else {
            setIsLoading(true);
            const result = await DB.family.register(inputs);
            setIsLoading(false);

            if(result.message) return setInfo({ type: "error", message: result.message });
        
            else {
                setInfo({ type: "success", message: `Family ${inputs.name} was created successfully!` });
                changePanel(true);
            }
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