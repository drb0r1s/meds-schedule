import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Schedules.css";
import Loading from "../../components/loading/Loading";
import { DB } from "../../functions/DB";
import { images } from "../../data/images";

const Schedules = () => {
    const [family, setFamily] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        if(token === null) navigate("/");

        else {
            const getFamily = async () => {
                const result = await DB.loggedIn(token);
                
                if(result.message) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
                
                setFamily(result);
                setIsLoading(false);
            }

            getFamily();
        }
    }, []);

    useEffect(() => {
        console.log(family);
    }, [family]);
    
    return(
        <section className="schedules">
            {isLoading ? <Loading /> : <>
                <h2>Welcome back to <span>{family.name}</span>!</h2>

                <div className="list">
                    <button className="add-button"><img src={images.plusIcon} alt="ADD" /></button>
                </div>
            </>}
        </section>
    );
}

export default Schedules;