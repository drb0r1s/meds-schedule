import React from "react";
import "./Calendar.css";
import { ExtendedDate } from "../../functions/ExtendedDate";
import { images } from "../../data/images";

const Calendar = ({ time }) => {
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const dates = getDates();

    const hours = new Array(24).fill(0);
    const timeslots = new Array(7 * 24).fill(0);

    function getDates() {
        const dates = new Array(7);
        
        const date = time ? new Date(time) : new Date();
        
        const dayOfTheWeek = adjustDay(date.getDay());
        const dayOfTheMonth = date.getDate();

        const currentMonth = date.getMonth();

        dates[dayOfTheWeek] = dayOfTheMonth;

        let prevValue = dayOfTheMonth;
        
        // Looping from the current day of the week to the start of the week (if the current day of the week is not Monday).
        if(dayOfTheWeek > 0) for(let i = dayOfTheWeek - 1; i >= 0; i--) {            
            prevValue--;

            if(!prevValue) {
                prevValue = ExtendedDate.monthLengths[currentMonth === 0 ? 11 : currentMonth - 1];
                dates[i] = prevValue;
            }

            else dates[i] = prevValue;
        }

        let nextValue = dayOfTheMonth;

        // Looping from the current day of the week to the end of the week (if the current day of the week is not Sunday).
        if(dayOfTheWeek < 6) for(let i = dayOfTheWeek + 1; i <= 6; i++) {
            nextValue++;

            if(nextValue > ExtendedDate.monthLengths[currentMonth]) {
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
    );
}

export default Calendar;