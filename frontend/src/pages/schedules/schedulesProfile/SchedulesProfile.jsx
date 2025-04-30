import React from "react";
import { useNavigate } from "react-router";
import "./SchedulesProfile.css";
import { images } from "../../../data/images";

const SchedulesProfile = ({ family, profileModalHolderRef, profileModalRef, disableProfileModal }) => {
    const navigate = useNavigate();
    
    const buttons = {
        first: ["inventory", "notifications", "history"],
        second: ["edit", "sign out"]
    };

    const buttonIcons = {
        first: [images.medicationIcon, images.notificationIcon, images.historyIcon],
        second: [images.penIcon, images.signOutIcon]
    };

    function handleButton(button) {
        switch(button) {
            case "inventory": break;
            case "notifications": break;
            case "history": break;
            case "edit": break;
            case "sign out":
                localStorage.removeItem("token");
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
            <div className="schedules-profile" ref={profileModalRef}>
                <div
                    className="background"
                    style={family.color ? { background: `linear-gradient(${family.color} 0, #1c1a1a 95%)` } : {}}
                >
                    <button onClick={disableProfileModal}><img src={images.xIcon} alt="X" /></button>
                    <h2>{family.name}</h2>
                </div>

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