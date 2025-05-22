import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "./SchedulesProfile.css";
import Loading from "../../../components/loading/Loading";
import Edit from "../../../components/edit/Edit";
import GeneralInfo from "../../../components/generalInfo/GeneralInfo";
import SchedulesProfileAdmin from "./schedulesProfileAdmin/SchedulesProfileAdmin";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";

const SchedulesProfile = ({ account, setAccount, profileModalHolderRef, profileModalRef, disableProfileModal, setInfo }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [modals, setModals] = useState({ edit: false, admin: false });

    const editModalRef = useRef(null);
    const adminModalRef = useRef(null);
    
    const navigate = useNavigate();
    
    const buttons = {
        first: ["inventory", "notifications", "history"],
        second: ["admin mode", "sign out"]
    };

    const buttonIcons = {
        first: [images.medicationIcon, images.notificationIcon, images.historyIcon],
        second: [images.adminIcon, images.signOutIcon]
    };

    useEffect(() => {
        if(modals.edit) setTimeout(() => { editModalRef.current.id = "edit-active" }, 10);
    }, [modals.edit]);

    useEffect(() => {
        if(modals.admin) setTimeout(() => { adminModalRef.current.id = "schedules-profile-admin-active" }, 10);
    }, [modals.admin]);

    function disableEditModal() {
        editModalRef.current.id = "";
        setTimeout(() => setModals({...modals, edit: false}), 300);
    }

    function disableAdminModal() {
        adminModalRef.current.id = "";
        setTimeout(() => setModals({...modals, admin: false}), 300);
    }

    async function handleButton(button) {
        switch(button) {
            case "inventory": break;
            case "notifications": break;
            case "history": break;
            case "admin mode":
                setModals({...modals, admin: true});
                break;
            case "edit":
                setModals({...modals, edit: true});
                break;
            case "sign out":
                setIsLoading(true);
                await DB.account.logout();
                setIsLoading(false);

                navigate("/");

                break;
            default:
        }
    }

    console.log(account)
    
    return(
        <div
            className="schedules-profile-holder"
            ref={profileModalHolderRef}
            onClick={e => {
                if(e.target.classList.contains("schedules-profile-holder")) disableProfileModal();
            }}
        >
            {isLoading && <Loading />}
            
            {modals.edit && <Edit
                type="account"
                editModalRef={editModalRef}
                disableEditModal={disableEditModal}
                values={account}
                setValues={setAccount}
                setForeignInfo={setInfo}
            />}

            {modals.admin && <SchedulesProfileAdmin
                account={account}
                setAccount={setAccount}
                adminModalRef={adminModalRef}
                disableAdminModal={disableAdminModal}
                setInfo={setInfo}
            />}
            
            <div className="schedules-profile" ref={profileModalRef}>
                <div
                    className="background"
                    style={account.color ? { background: `linear-gradient(${account.color} 0, #1c1a1a 95%)` } : {}}
                >
                    <button onClick={disableProfileModal}><img src={images.xIcon} alt="X" /></button>
                    <h2>{account.name}</h2>
                </div>

                {account.admin && <div className="admin-info">
                    <img src={images.adminIcon} alt="ADMIN" />
                    <p>You're logged in as <span>Administrator</span></p>
                </div>}
                
                <GeneralInfo type="account" values={account} />

                <div className="menu">
                    <div className="first-group">
                        {buttons.first.map((button, index) => {
                            return <button
                                key={index}
                                onClick={() => handleButton(button)}
                            >
                                <img src={buttonIcons.first[index]} alt={button} />
                                <p>{button}</p>
                            </button>;
                        })}
                    </div>

                    <div className="second-group">
                        {buttons.second.map((button, index) => {
                            return <button
                                key={index}
                                onClick={() => handleButton(button)}
                            >
                                <img src={buttonIcons.second[index]} alt={button} />
                                <p>{button}</p>
                            </button>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SchedulesProfile;