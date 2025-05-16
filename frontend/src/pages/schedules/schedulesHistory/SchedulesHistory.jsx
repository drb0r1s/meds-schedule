import React, { useState, useEffect, useRef } from "react";
import "./SchedulesHistory.css";
import Loading from "../../../components/loading/Loading";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";

const SchedulesHistory = ({ family, historyModalRef, disableHistoryModal }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noEvents, setNoEvents] = useState(false);

    useEffect(() => {
        const getEvents = async () => {
            const result = await DB.family.getEvents(family.id);
            setIsLoading(false);

            if(result.message) return;

            if(!result.length) {
                setNoEvents(true);
                return;
            }
            
            setEvents(result);
        }

        getEvents();
    }, []);

    useEffect(() => {
        if(events.length && noEvents) setNoEvents(false);
        else if(!events.length && !noEvents) setNoEvents(true);
    }, [events]);
    
    return(
        <div className="schedules-history" ref={historyModalRef}>
            <button
                className="x-button"
                onClick={disableHistoryModal}
            ><img src={images.xIcon} alt="X" /></button>

            <h2>History</h2>

            {isLoading ? <Loading /> : <div
                className="list"
                style={noEvents ? { justifyContent: "center" } : {}}
            >
                {!isLoading && noEvents ? <strong>History is empty.</strong> : <>
                    {events.map((event, index) => {
                        
                    })}
                </>}
            </div>}
        </div>
    );
}

export default SchedulesHistory;