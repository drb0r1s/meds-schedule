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

    const menuButtons = ["profile", "inventory", "create", "notifications", "history"];
    const menuButtonIcons = [images.profileIcon, images.medicationIcon, images.plusIcon, images.notificationIcon, images.historyIcon];
    
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

    function handleMenuButton(button) {
        switch(button) {
            case "profile": break;
            case "inventory": break;
            case "create":
                setIsCreateModalActive(true);
                break;
            case "notifications": break;
            case "history": break;
        }
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
                    {!schedules.length ? <strong>There are no schedules.</strong> : schedules.map((schedule, index) => {
                        return <button
                            key={index}
                            className="schedule-button"
                        >
                            <div
                                className="background"
                                style={schedule.color ? { backgroundColor: schedule.color } : {}}
                            ></div>
                            <p>{schedule.name}</p>
                        </button>;
                    })}
                </div>

                <div className="menu">
                    {menuButtons.map((button, index) => {
                        return <button key={index} onClick={() => handleMenuButton(button)}>
                            <img src={menuButtonIcons[index]} alt={button.toUpperCase()} />
                        </button>;
                    })}
                </div>
            </>}
        </section>
    );
}

export default Schedules;