import React from "react";
import "./Account.css";
import Logo from "../../components/logo/Logo";
import AccountLogin from "./AccountLogin";

const Account = () => {
    return(
        <section className="account">
            <div className="logo-holder">
                <Logo />
                <p>Log in to your account</p>
            </div>

            <AccountLogin />

            <p>Don't have an account? <button className="register-button">Register</button></p>

            <button className="continue-button">Continue</button>
        </section>
    );
}

export default Account;