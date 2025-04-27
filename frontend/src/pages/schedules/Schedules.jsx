import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Schedules.css";
import { DB } from "../../functions/DB";

const Schedules = () => {
    const [family, setFamily] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        if(token === null) navigate("/");

        else {
            const getFamily = async () => {
                const result = await DB.loggedIn(token);
                setFamily(result);
            }
        }
    }, []);

    useEffect(() => {
        console.log(family);
    }, [family]);
    
    return(
        <section className="schedules">
            <h2></h2>
        </section>
    );
}

export default Schedules;