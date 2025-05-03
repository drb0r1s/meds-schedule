import React from "react";
import "./DosesTimeslot.css";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const DosesTimeslot = ({ timeslotDoses, dosesTimeslotModalRef, disableDosesTimeslotModal }) => {
    const [time, doses] = timeslotDoses;
    const [year, month, day, weekDay, hour] = time.split("-");

    console.log(doses)
    
    return(
        <div className="doses-timeslot" ref={dosesTimeslotModalRef}>
            <button
                className="x-button"
                onClick={disableDosesTimeslotModal}
            ><img src={images.xIcon} alt="X" /></button>

            <h2>Doses for <span>{hour}:00 {day}.{month}.{year}.</span></h2>


        </div>
    );
}

export default DosesTimeslot;