import React, { useState, useEffect } from "react";
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
    const [inputs, setInputs] = useState({ name: "", password: "", repeatPassword: "", type: "individual", adminPassword: "" });
    const [info, setInfo] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const getAccount = async () => {
            setIsLoading(true);
            const result = await DB.account.loggedIn();
            setIsLoading(false);

            if(result.id) navigate("/schedules");
        }

        getAccount();
    }, []);

    function changePanel(login) {
        setIsLogin(login);
        setInputs({ name: "", password: "", repeatPassword: "", type: "individual", adminPassword: "" });
    }

    async function handleContinue() {
        const isError = CheckInputs.account(inputs, setInfo, isLogin);
        if(isError) return;
        
        if(isLogin) {
            setIsLoading(true);
            const result = await DB.account.login(inputs);
            setIsLoading(false);

            if(result.message) return setInfo({ type: "error", message: result.message });
            navigate("/schedules");
        }

        else {
            setIsLoading(true);
            const result = await DB.account.register(inputs);
            setIsLoading(false);

            if(result.message) return setInfo({ type: "error", message: result.message });
        
            else {
                setInfo({ type: "success", message: `Account ${inputs.name} was created successfully!` });
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