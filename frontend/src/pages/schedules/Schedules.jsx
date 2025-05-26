import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "./Schedules.css";
import SchedulesProfile from "./schedulesProfile/SchedulesProfile";
import SchedulesInventory from "./schedulesInventory/SchedulesInventory";
import SchedulesCreate from "./schedulesCreate/SchedulesCreate";
import SchedulesNotifications from "./schedulesNotifications/SchedulesNotifications";
import SchedulesHistory from "./schedulesHistory/SchedulesHistory";
import Loading from "../../components/loading/Loading";
import Info from "../../components/Info/Info";
import { DB } from "../../functions/DB";
import { ExtendedString } from "../../functions/ExtendedString";
import { images } from "../../data/images";

const Schedules = () => {
    const [account, setAccount] = useState({});
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [schedulesLoading, setSchedulesLoading] = useState(true);
    const [noSchedules, setNoSchedules] = useState(false);
    const [modals, setModals] = useState({ profile: false, inventory: false, create: false, notifications: false, history: false });
    const [info, setInfo] = useState({ type: "", message: "" });

    const profileModalHolderRef = useRef(null);
    const profileModalRef = useRef(null);
    const inventoryModalRef = useRef(null);
    const createModalRef = useRef(null);
    const notificationsModalRef = useRef(null);
    const historyModalRef = useRef(null);

    const navigate = useNavigate();

    const menuButtons = ["profile", "inventory", "create", "notifications", "history"];
    const menuButtonIcons = [images.profileIcon, images.medicationIcon, images.plusIcon, images.notificationIcon, images.historyIcon];

    useEffect(() => {
        const getAccount = async () => {
            const result = await DB.account.loggedIn();
                
            if(result.message) {
                navigate("/");
                return;
            }
                
            setAccount(result);
            setIsLoading(false);
        }

        getAccount();
    }, []);

    useEffect(() => {
        if(!Object.keys(account).length) return;

        const getSchedules = async () => {
            const result = await DB.account.getSchedules(account.id);

            if(result.message) return;

            setSchedules(result);
            setSchedulesLoading(false);
            if(!result.length) setNoSchedules(true);
        }

        getSchedules();
    }, [account]);

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
        if(modals.notifications) setTimeout(() => { notificationsModalRef.current.id = "schedules-notifications-active" });
    }, [modals.notifications]);

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

    function disableNotificationsModal() {
        notificationsModalRef.current.id = "";
        setTimeout(() => setModals({...modals, notifications: false}), 300);
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
            case "notifications":
                setModals({...modals, notifications: true});
                break;
            case "history":
                setModals({...modals, history: true});
                break;
            default:
        }
    }
    
    return(
        <section className="schedules">
            {isLoading ? <Loading /> : <>
                {info.message && <Info info={info} setInfo={setInfo} />}
                
                {modals.profile && <SchedulesProfile
                    account={account}
                    setAccount={setAccount}
                    profileModalHolderRef={profileModalHolderRef}
                    profileModalRef={profileModalRef}
                    disableProfileModal={disableProfileModal}
                    setInfo={setInfo}
                />}

                {modals.inventory && <SchedulesInventory
                    account={account}
                    inventoryModalRef={inventoryModalRef}
                    disableInventoryModal={disableInventoryModal}
                />}
                
                {modals.create && <SchedulesCreate
                    account={account}
                    createModalRef={createModalRef}
                    disableCreateModal={disableCreateModal}
                    setSchedules={setSchedules}
                    setInfo={setInfo}
                />}

                {modals.notifications && <SchedulesNotifications
                    account={account}
                    notificationsModalRef={notificationsModalRef}
                    disableNotificationsModal={disableNotificationsModal}
                    setInfo={setInfo}
                />}

                {modals.history && <SchedulesHistory
                    account={account}
                    historyModalRef={historyModalRef}
                    disableHistoryModal={disableHistoryModal}
                    setInfo={setInfo}
                />}
                
                <h2>Welcome back, <span>{account.name}</span>!</h2>

                {schedulesLoading && !noSchedules ? <Loading /> : <div
                    className="list"
                    style={!schedules.length ? { justifyContent: "center" } : {}}
                >
                    {noSchedules ? <strong>There are no schedules.</strong> : schedules.map((schedule, index) => {
                        return <button
                            key={index}
                            className="schedule-button"
                            onClick={() => navigate(`/schedules/${ExtendedString.getDosesURL(schedule.id, schedule.name)}`, { state: { account, schedule } })}
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