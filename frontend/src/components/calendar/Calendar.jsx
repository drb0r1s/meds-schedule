import React, { useState, useEffect } from "react";
import "./Calendar.css";
import { ExtendedDate } from "../../functions/ExtendedDate";
import { images } from "../../data/images";

const Calendar = ({ time, doses, setModals }) => {
    const [dosesMatrix, setDosesMatrix] = useState(Array.from({ length: 24 }, () => Array(7).fill([])));
    
    const date = time ? new Date(time) : new Date();

    const calendar = {
        weekDay: adjustDay(date.getDay()),
        monthDay: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
    };
    
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const week = getDates();

    const hours = new Array(24).fill(0);
    const timeslots = Array.from({ length: 24 }, () => Array(7).fill(0));

    useEffect(() => {
        if(!doses) return;

        const newDosesMatrix = Array.from({ length: 24 }, () => Array(7).fill([]));

        for(let i = 0; i < 24; i++) {
            for(let j = 0; j < 7; j++) {
                doses.forEach(dose => {
                    const doseTime = ExtendedDate.parseSQL(dose.time);
                    const doseTimeWeekDay = adjustDay(new Date(dose.time).getDay());
                                        
                    if(
                        doseTime.year === week[j].year &&
                        (doseTime.month - 1) === week[j].month && // DATETIME in MySQL starts from index 1 (January) for months, adjustment is needed.
                        doseTime.day === week[j].day &&
                        doseTimeWeekDay === j &&
                        doseTime.hours === i
                    ) newDosesMatrix[i][j].push(dose);
                });
            }
        }

        setDosesMatrix(newDosesMatrix);
    }, [doses]);

    function getDates() {
        const week = new Array(7);
        week[calendar.weekDay] = { year: calendar.year, month: calendar.month, day: calendar.monthDay };

        // Spread operator here is important, otherwise we would update the same week object.
        const prevWeekDay = {...week[calendar.weekDay]};
        
        // Looping from the current day of the week to the start of the week (if the current day of the week is not Monday).
        if(calendar.weekDay > 0) for(let i = calendar.weekDay - 1; i >= 0; i--) {            
            prevWeekDay.day--;

            if(!prevWeekDay.day) {
                prevWeekDay.day = ExtendedDate.monthLengths[calendar.month === 0 ? 11 : calendar.month - 1];
                
                prevWeekDay.month--;

                // January has index 0, we went to previous year if index is -1.
                if(prevWeekDay.month === -1) {
                    prevWeekDay.month = 11; // December (index 11).
                    prevWeekDay.year--;
                }
            }

            week[i] = {...prevWeekDay};
        }

        // Spread operator here is important, otherwise we would update the same week object.
        const nextWeekDay = {...week[calendar.weekDay]};

        // Looping from the current day of the week to the end of the week (if the current day of the week is not Sunday).
        if(calendar.weekDay < 6) for(let i = calendar.weekDay + 1; i <= 6; i++) {
            nextWeekDay.day++;

            if(nextWeekDay.day > ExtendedDate.monthLengths[calendar.month]) {
                nextWeekDay.day = 1;
                
                nextWeekDay.month++;

                // December has index 11, we went to next year if index is 12.
                if(nextWeekDay.month === 12) {
                    nextWeekDay.month = 0;
                    nextWeekDay.year++;
                }
            }

            week[i] = {...nextWeekDay};
        }

        return week;
    }

    // new Date.getDay() starts from Sunday (index 0).
    // Function adjustDay() is readjusting starting day (starting from Monday).
    function adjustDay(day) {
        if(day === 0) return 6;
        return day - 1;
    }

    function isToday(id) {
        const today = new Date();
        const [year, month, monthDay] = id.split("-");

        if(today.getFullYear() === parseInt(year) && today.getMonth() === parseInt(month) && today.getDate() === parseInt(monthDay)) return true;
        return false;
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
                        return <p key={index} className="day">{day} {week[index].day}</p>;
                    })}
                </div>

                <div className="timeslots">
                    {timeslots.map((timeslotHour, hourIndex) => {
                        return timeslotHour.map((timeslotDay, dayIndex) => {
                            const timeslotId = `${week[dayIndex].year}-${week[dayIndex].month}-${week[dayIndex].day}-${dayIndex}-${hourIndex}`;
                            
                            return <div
                                key={timeslotId}
                                className={`timeslot ${isToday(timeslotId) ? "timeslot-today" : ""}`}
                                id={timeslotId}
                                onClick={() => setModals(prevModals => { return {...prevModals, timeslot: [timeslotId, dosesMatrix[hourIndex][dayIndex]]} })}
                            >
                                {doses.map((dose, index) => {
                                    const doseTime = ExtendedDate.parseSQL(dose.time);
                                    const doseTimeWeekDay = adjustDay(new Date(dose.time).getDay());
                                    
                                    if(
                                        doseTime.year === week[dayIndex].year &&
                                        (doseTime.month - 1) === week[dayIndex].month && // DATETIME in MySQL starts from index 1 (January) for months, adjustment is needed.
                                        doseTime.day === week[dayIndex].day &&
                                        doseTimeWeekDay === dayIndex &&
                                        doseTime.hours === hourIndex
                                    ) return <div
                                        key={index}
                                        className="dose"
                                    >{dose.name}</div>;

                                    return <React.Fragment key={index}></React.Fragment>;
                                })}
                            </div>;
                        });
                    })}
                </div>
            </div>
        </div>
    );
}

export default Calendar;