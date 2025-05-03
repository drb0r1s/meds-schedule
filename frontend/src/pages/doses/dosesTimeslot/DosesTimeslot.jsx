import React from "react";
import "./DosesTimeslot.css";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const DosesTimeslot = ({ timeslotDoses, dosesTimeslotModalRef, disableDosesTimeslotModal }) => {
    const [time, doses] = timeslotDoses;
    const [year, month, day, weekDay, hour] = time.split("-");
    
    return(
        <div className="doses-timeslot" ref={dosesTimeslotModalRef}>
            <button
                className="x-button"
                onClick={disableDosesTimeslotModal}
            ><img src={images.xIcon} alt="X" /></button>

            <h2>Doses for <span>{hour >= 10 ? hour : `0${hour}`}:00 {day}.{parseInt(month) + 1}.{year}.</span></h2>

            <div
                className="list"
                style={!doses.length ? { justifyContent: "center" } : {}}
            >
                {!doses.length ? <strong>There are no doses.</strong> : <>
                    {doses.map((dose, index) => {
                        return <div
                            key={index}
                            className="dose"
                        >
                            <img src={images.pillIcon} alt="PILL" />

                            <div className="dose-info">
                                <strong>{dose.name}</strong>
                                
                                <div className="dose-info-time">
                                    <p>{ExtendedDate.displayDatetime(dose.time)}</p>
                                    <p>{dose.status}</p>
                                </div>
                            </div>
                        </div>;
                    })}
                </>}
            </div>
        </div>
    );
}

export default DosesTimeslot;