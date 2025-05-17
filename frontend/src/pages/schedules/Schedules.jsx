import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "./Schedules.css";
import SchedulesProfile from "./schedulesProfile/SchedulesProfile";
import SchedulesInventory from "./schedulesInventory/SchedulesInventory";
import SchedulesCreate from "./schedulesCreate/SchedulesCreate";
import SchedulesHistory from "./schedulesHistory/SchedulesHistory";
import Loading from "../../components/loading/Loading";
import Info from "../../components/Info/Info";
import { DB } from "../../functions/DB";
import { ExtendedString } from "../../functions/ExtendedString";
import { images } from "../../data/images";

const Schedules = () => {
    const [family, setFamily] = useState({});
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [schedulesLoading, setSchedulesLoading] = useState(true);
    const [noSchedules, setNoSchedules] = useState(false);
    const [modals, setModals] = useState({ profile: false, inventory: false, create: false, history: false });
    const [info, setInfo] = useState({ type: "", message: "" });

    const profileModalHolderRef = useRef(null);
    const profileModalRef = useRef(null);
    const inventoryModalRef = useRef(null);
    const createModalRef = useRef(null);
    const historyModalRef = useRef(null);

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
            const result = await DB.family.getSchedules(family.id);

            if(result.message) return;

            setSchedules(result);
            setSchedulesLoading(false);
            if(!result.length) setNoSchedules(true);
        }

        getSchedules();
    }, [family]);

    useEffect(() => {
        if(schedules.length && noSchedules) setNoSchedules(false);
    }, [schedules]);

    useEffect(() => {
        if(modals.profile) setTimeout(() => {
            profileModalHolderRef.current.id = "schedules-profile-holder-active";
            setTimeout(() => { profileModalRef.current.id = "schedules-profile-active" }, 300);
        }, 10);
    }, [modals.profile]);

    useEffect(() => {
        if(modals.inventory) setTimeout(() => { inventoryModalRef.current.id = "schedules-inventory-active" }, 10);
    }, [modals.inventory]);

    useEffect(() => {
        if(modals.create) setTimeout(() => { createModalRef.current.id = "schedules-create-active" }, 10);
    }, [modals.create]);

    useEffect(() => {
        if(modals.history) setTimeout(() => { historyModalRef.current.id = "schedules-history-active" }, 10);
    }, [modals.history]);

    function disableProfileModal() {
        profileModalRef.current.id = "";
        
        setTimeout(() => {
            profileModalHolderRef.current.id = "";
            setTimeout(() => setModals({...modals, profile: false}), 300);
        }, 300);
    }

    function disableInventoryModal() {
        inventoryModalRef.current.id = "";
        setTimeout(() => setModals({...modals, inventory: false}), 300);
    }

    function disableCreateModal() {
        createModalRef.current.id = "";
        setTimeout(() => setModals({...modals, create: false}), 300);
    }

    function disableHistoryModal() {
        historyModalRef.current.id = "";
        setTimeout(() => setModals({...modals, history: false}), 300);
    }

    function handleMenuButton(button) {
        switch(button) {
            case "profile":
                setModals({...modals, profile: true});
                break;
            case "inventory":
                setModals({...modals, inventory: true});
                break;
            case "create":
                setModals({...modals, create: true});
                break;
            case "notifications": break;
            case "history":
                setModals({...modals, history: true});
                break;
        }
    }
    
    return(
        <section className="schedules">
            {isLoading ? <Loading /> : <>
                {info.message && <Info info={info} setInfo={setInfo} />}
                
                {modals.profile && <SchedulesProfile
                    family={family}
                    setFamily={setFamily}
                    profileModalHolderRef={profileModalHolderRef}
                    profileModalRef={profileModalRef}
                    disableProfileModal={disableProfileModal}
                    setInfo={setInfo}
                />}

                {modals.inventory && <SchedulesInventory
                    family={family}
                    inventoryModalRef={inventoryModalRef}
                    disableInventoryModal={disableInventoryModal}
                />}
                
                {modals.create && <SchedulesCreate
                    family={family}
                    createModalRef={createModalRef}
                    disableCreateModal={disableCreateModal}
                    setSchedules={setSchedules}
                    setInfo={setInfo}
                />}

                {modals.history && <SchedulesHistory
                    family={family}
                    historyModalRef={historyModalRef}
                    disableHistoryModal={disableHistoryModal}
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
                            onClick={() => navigate(`/schedules/${ExtendedString.getDosesURL(schedule.id, schedule.name)}`, { state: { schedule } })}
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