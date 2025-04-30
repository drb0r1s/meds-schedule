import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import "./Doses.css";
import Loading from "../../components/loading/Loading";
import { DB } from "../../functions/DB";
import { images } from "../../data/images";

const Doses = () => {
    const { doses } = useParams();
    const location = useLocation();

    const [schedule, setSchedule] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const scheduleId = doses.split("-")[doses.split("-").length - 1];
    
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const dates = getDates();

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

    function getDates() {
        const dates = new Array(7);
        const dayOfTheWeek = adjustDay(new Date().getDay());
        const dayOfTheMonth = new Date().getDate();

        const currentMonth = new Date().getMonth();
        const monthLengths = [31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        dates[dayOfTheWeek] = dayOfTheMonth;

        let prevValue = dayOfTheMonth;
        
        // Looping from the current day of the week to the start of the week (if the current day of the week is not Monday).
        if(dayOfTheWeek > 0) for(let i = dayOfTheWeek - 1; i >= 0; i--) {            
            prevValue--;

            if(!prevValue) {
                prevValue = monthLengths[currentMonth === 0 ? 11 : currentMonth - 1];
                dates[i] = prevValue;
            }

            else dates[i] = prevValue;
        }

        let nextValue = dayOfTheMonth;

        // Looping from the current day of the week to the end of the week (if the current day of the week is not Sunday).
        if(dayOfTheWeek < 6) for(let i = dayOfTheWeek + 1; i <= 6; i++) {
            nextValue++;

            if(nextValue > monthLengths[currentMonth]) {
                nextValue = 1;
                dates[i] = nextValue;
            }

            else dates[i] = nextValue;
        }

        // new Date.getDay() starts from Sunday (index 0).
        // Function adjustDay() is readjusting starting day (starting from Monday).
        function adjustDay(day) {
            if(day === 0) return 6;
            return day - 1;
        }

        return dates;
    }

    function isLeapYear(year) {
        return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
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
                    
                    <div className="hours">
                        {hours.map((hour, index) => {
                            return <p key={index} className="hour">{index < 10 ? `0${index}` : index}</p>;
                        })}
                    </div>

                    <div className="timeslots-holder">
                        <div className="days">
                            {days.map((day, index) => {
                                return <p key={index} className="day">{day} {dates[index]}</p>;
                            })}
                        </div>

                        <div className="timeslots">
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