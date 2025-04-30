import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router";
import "./Doses.css";
import Loading from "../../components/loading/Loading";
import { DB } from "../../functions/DB";
import { images } from "../../data/images";

const Doses = () => {
    const { doses } = useParams();
    const location = useLocation();

    const [schedule, setSchedule] = useState({});
    const [hoursGap, setHoursGap] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const hoursRef = useRef(null);
    const timeslotsRef = useRef(null);

    const scheduleId = doses.split("-")[doses.split("-").length - 1];
    
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const hours = new Array(24).fill(0);
    const timeslots = new Array(7 * 24).fill(0);

    useEffect(() => {
        if(location.state?.schedule) {
            setSchedule(location.state.schedule);
            setIsLoading(false);
        }

        else {
            const getSchedule = async () => {
                const result = await DB.schedule.get(scheduleId);
                
                if(result.message) return;

                setSchedule(result);
                setIsLoading(false);
            }

            getSchedule();
        }
    }, []);

    useEffect(() => {
        if(!Object.keys(schedule).length) return;
        setHoursGap(calculateHoursGap());
    }, [schedule]);

    function calculateHoursGap() {
        const timeslot = timeslotsRef.current.firstChild;
        const timeslotHeight = parseFloat(getComputedStyle(timeslot).getPropertyValue("height"));

        const hour = hoursRef.current.firstChild;
        const hourHeight = parseFloat(getComputedStyle(hour).getPropertyValue("height"));

        const gap = `${timeslotHeight - hourHeight}px`;
        return gap;
    }
    
    return(
        <section className="doses">
            {isLoading ? <Loading /> : <>
                <h2>{schedule.name}</h2>

                <div className="calendar">
                    <img
                        src={images.pillIcon}
                        alt="PILL"
                        className="pill-icon"
                    />
                    
                    <div className="hours" ref={hoursRef}>
                        {hours.map((hour, index) => {
                            return <p key={index} className="hour">{index < 10 ? `0${index}` : index}</p>;
                        })}
                    </div>

                    <div className="timeslots-holder">
                        <div className="days">
                            {days.map((day, index) => {
                                return <p key={index} className="day">{day}</p>;
                            })}
                        </div>

                        <div className="timeslots" ref={timeslotsRef}>
                            {timeslots.map((timeslot, index) => {
                                return <div key={index} className="timeslot"></div>;
                            })}
                        </div>
                    </div>
                </div>
            </>}
        </section>
    );
}

export default Doses;