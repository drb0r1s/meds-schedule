import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "./Schedules.css";
import SchedulesCreate from "./SchedulesCreate";
import Loading from "../../components/loading/Loading";
import Info from "../../components/Info/Info";
import { DB } from "../../functions/DB";
import { images } from "../../data/images";

const Schedules = () => {
    const [family, setFamily] = useState({});
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [schedulesLoading, setSchedulesLoading] = useState(true);
    const [noSchedules, setNoSchedules] = useState(false);
    const [isCreateModalActive, setIsCreateModalActive] = useState(false);
    const [info, setInfo] = useState({ type: "", message: "" });

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
        if(!Object.keys(family).length) return;

        const getSchedules = async () => {
            const result = await DB.schedule.get(family.id);

            if(result.message) return;

            setSchedules(result);
            setSchedulesLoading(false);
            if(!result.length) setNoSchedules(true);
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
                {info.message && <Info info={info} setInfo={setInfo} />}
                
                {isCreateModalActive && <SchedulesCreate
                    family={family}
                    createModalRef={createModalRef}
                    disableCreateModal={disableCreateModal}
                    setSchedules={setSchedules}
                    setInfo={setInfo}
                />}
                
                <h2>Welcome back to <span>{family.name}</span>!</h2>

                {schedulesLoading && !noSchedules ? <Loading /> : <div
                    className="list"
                    style={!schedules.length ? { justifyContent: "center" } : {}}
                >
                    {noSchedules ? <strong>There are no schedules.</strong> : schedules.map((schedule, index) => {
                        return <button
                            key={index}
                            className="schedule-button"
                        >
                            <div
                                className="background"
                                style={schedule.color ? { backgroundColor: schedule.color } : {}}
                            >
                                <img src={images.pillIcon} alt="PILL" />
                            </div>

                            <p>{schedule.name}</p>
                        </button>;
                    })}
                </div>}

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