import React, { useState, useEffect } from "react";
import "./SchedulesNotifications.css";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";
import Loading from "../../../components/loading/Loading";

const SchedulesNotifications = ({ account, notificationsModalRef, disableNotificationsModal, setInfo }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noNotifications, setNoNotifications] = useState(false);

    useEffect(() => {
        const getNotifications = async () => {
            const result = await DB.account.getNotifications(account.id);
            setIsLoading(false);

            if(result === null || result === undefined) return;
            
            if(result.message) {
                setInfo({ type: "error", message: result.message });
                return;
            }

            if(!result.length) {
                setNoNotifications(true);
                return;
            }

            setNoNotifications(result);
        }

        getNotifications();
    }, []);
    
    return(
        <div className="schedules-notifications" ref={notificationsModalRef}>
            <div
                className="x-button"
                onClick={disableNotificationsModal}
            ><img src={images.xIcon} alt="X" /></div>

            <h2>Notifications</h2>

            {isLoading ? <Loading /> : <div
                className="list"
                style={noNotifications ? { justifyContent: "center" } : {}}
            >
                {!isLoading && noNotifications ? <strong>There are no notifications.</strong> : <>
                    
                </>}
            </div>}
        </div>
    );
}

export default SchedulesNotifications;