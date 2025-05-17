import React, { useState, useEffect } from "react";
import "./SchedulesHistory.css";
import Loading from "../../../components/loading/Loading";
import { DB } from "../../../functions/DB";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { ExtendedString } from "../../../functions/ExtendedString";
import { images } from "../../../data/images";

const SchedulesHistory = ({ family, historyModalRef, disableHistoryModal, setInfo }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noEvents, setNoEvents] = useState(false);

    useEffect(() => {
        const getEvents = async () => {
            const result = await DB.event.getAll(family.id);
            setIsLoading(false);

            if(result.message) {
                setInfo({ type: "error", message: result.message });
                return;
            }

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
                        return <div
                            key={index}
                            className="event"
                        >
                            <img src={images.historyIcon} alt="EVENT" />

                            <div className="event-info">
                                <strong>{event.event_name}</strong>
                                <p dangerouslySetInnerHTML={{ __html: ExtendedString.parsePlaceholders(event.description, event) }}></p>
                                <span>{ExtendedDate.display(event.created_at)}</span>
                            </div>
                        </div>;
                    })}
                </>}
            </div>}
        </div>
    );
}

export default SchedulesHistory;