import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "./SchedulesProfile.css";
import Edit from "../../../components/edit/Edit";
import GeneralInfo from "../../../components/generalInfo/GeneralInfo";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";

const SchedulesProfile = ({ account, setAccount, profileModalHolderRef, profileModalRef, disableProfileModal, setInfo }) => {
    const [isEditModalActive, setIsEditModalActive] = useState(false);
    const editModalRef = useRef(null);
    
    const navigate = useNavigate();
    
    const buttons = {
        first: ["inventory", "notifications", "history"],
        second: ["edit", "sign out"]
    };

    const buttonIcons = {
        first: [images.medicationIcon, images.notificationIcon, images.historyIcon],
        second: [images.penIcon, images.signOutIcon]
    };

    useEffect(() => {
        if(isEditModalActive) setTimeout(() => { editModalRef.current.id = "edit-active" });
    }, [isEditModalActive]);

    function disableEditModal() {
        editModalRef.current.id = "";
        setTimeout(() => setIsEditModalActive(false), 300);
    }

    async function handleButton(button) {
        switch(button) {
            case "inventory": break;
            case "notifications": break;
            case "history": break;
            case "edit":
                setIsEditModalActive(true);
                break;
            case "sign out":
                await DB.account.logout();
                navigate("/");

                break;
            default:
        }
    }
    
    return(
        <div
            className="schedules-profile-holder"
            ref={profileModalHolderRef}
            onClick={e => {
                if(e.target.classList.contains("schedules-profile-holder")) disableProfileModal();
            }}
        >
            {isEditModalActive && <Edit
                type="account"
                editModalRef={editModalRef}
                disableEditModal={disableEditModal}
                values={account}
                setValues={setAccount}
                setForeignInfo={setInfo}
            />}
            
            <div className="schedules-profile" ref={profileModalRef}>
                <div
                    className="background"
                    style={account.color ? { background: `linear-gradient(${account.color} 0, #1c1a1a 95%)` } : {}}
                >
                    <button onClick={disableProfileModal}><img src={images.xIcon} alt="X" /></button>
                    <h2>{account.name}</h2>
                </div>

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