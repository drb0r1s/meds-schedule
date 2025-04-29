import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "./Schedules.css";
import SchedulesCreate from "./SchedulesCreate";
import Loading from "../../components/loading/Loading";
import { DB } from "../../functions/DB";
import { images } from "../../data/images";

const Schedules = () => {
    const [family, setFamily] = useState({});
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalActive, setIsCreateModalActive] = useState(false);

    const createModalRef = useRef(null);

    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        if(token === null) navigate("/");

        else {
            const getFamily = async () => {
                const result = await DB.family.loggedIn(token);
                
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
        const getSchedules = async () => {
            const result = await DB.schedule.get(family.id);

            if(result.message) return;

            setSchedules(result);
        }

        getSchedules();
    }, [family]);

    useEffect(() => {
        if(isCreateModalActive) setTimeout(() => { createModalRef.current.id = "schedules-create-active" }, 10);
    }, [isCreateModalActive]);

    function disableCreateModal() {
        createModalRef.current.id = "";
        setTimeout(() => setIsCreateModalActive(false), 300);
    }
    
    return(
        <section className="schedules">
            {isLoading ? <Loading /> : <>
                {isCreateModalActive && <SchedulesCreate
                    family={family}
                    createModalRef={createModalRef}
                    disableCreateModal={disableCreateModal}
                />}
                
                <h2>Welcome back to <span>{family.name}</span>!</h2>

                <div className="list">
                    <button
                        className="create-button"
                        onClick={() => setIsCreateModalActive(true)}
                    ><img src={images.plusIcon} alt="CREATE" /></button>
                </div>
            </>}
        </section>
    );
}

export default Schedules;