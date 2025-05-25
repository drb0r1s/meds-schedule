import React from "react";
import "./Unavailable.css";
import Logo from "../logo/Logo";

const Unavailable = () => {
    return(
        <section className="unavailable">
            <Logo />

            <div className="unavailable-content">
                <h2>This is a mobile application.</h2>
                <p>Please, open this application on mobile.</p>
            </div>
        </section>
    )
}

export default Unavailable;