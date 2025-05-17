import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SchedulesHistory.css";
import Loading from "../../../components/loading/Loading";
import { DB } from "../../../functions/DB";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { ExtendedString } from "../../../functions/ExtendedString";
import { images } from "../../../data/images";

const SchedulesHistory = ({ family, historyModalRef, disableHistoryModal, setInfo }) => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noEvents, setNoEvents] = useState(false);

    const navigate = useNavigate();

    const menuButtons = ["family", "schedule", "dose", "medication"];

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
            setFilteredEvents(result);
        }

        getEvents();
    }, []);

    useEffect(() => {
        if(filteredEvents.length && noEvents) setNoEvents(false);
        else if(!filteredEvents.length && !noEvents) setNoEvents(true);
    }, [filteredEvents]);
    
    function handleButton(button) {
        // If already active filter is pressed again, cancel the filter.
        if(filter === button) {
            setFilter("");
            setFilteredEvents(events);

            return;
        }

        const newFilteredEvents = [];

        for(let i = 0; i < events.length; i++) {
            if(events[i].type === button) newFilteredEvents.push(events[i]);
        }
        
        setFilter(button);
        setFilteredEvents(newFilteredEvents);
    }
    
    return(
        <div className="schedules-history" ref={historyModalRef}>
            <button
                className="x-button"
                onClick={disableHistoryModal}
            ><img src={images.xIcon} alt="X" /></button>

            <h2>History</h2>

            <div className="filters-menu">
                {menuButtons.map((button, index) => {
                    return <button
                        key={index}
                        id={filter === button ? "button-active" : ""}
                        onClick={() => handleButton(button)}
                    >{button}</button>
                })}
            </div>

            {isLoading ? <Loading /> : <div
                className="list"
                style={noEvents ? { justifyContent: "center" } : {}}
            >
                {!isLoading && noEvents ? <strong>History is empty.</strong> : <>
                    {filteredEvents.map((event, index) => {
                        return <div
                            key={index}
                            className="event"
                        >
                            <img src={images.historyIcon} alt="EVENT" />

                            <div className="event-info">
                                <strong>{event.event_name}</strong>
                                <p dangerouslySetInnerHTML={{ __html: ExtendedString.parsePlaceholders(event.description, event) }}></p>
                                
                                <div className="event-info-date-path">
                                    <span>{ExtendedDate.display(event.created_at)}</span>
                                    
                                    {event.type === "dose" && event.schedule_id && event.dose_id && <div
                                        className="path"
                                        onClick={() => navigate(`/schedules/${ExtendedString.getDosesURL(event.schedule_id, event.schedule_name)}`)}
                                    >
                                        <p>{event.schedule_name}</p>
                                        <img src={images.arrowPathIcon} alt=">" />
                                        <p>{event.dose_name}</p>
                                    </div>}
                                </div>
                            </div>
                        </div>;
                    })}
                </>}
            </div>}
        </div>
    );
}

export default SchedulesHistory;