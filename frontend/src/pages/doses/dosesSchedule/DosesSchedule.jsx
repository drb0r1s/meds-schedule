import React from "react";
import "./DosesSchedule.css";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const DosesSchedule = ({ schedule, dosesScheduleModalRef, disableDosesScheduleModal }) => {
    return(
        <div className="doses-schedule" ref={dosesScheduleModalRef}>
            <div
                className="x-button"
                onClick={disableDosesScheduleModal}
            ><img src={images.xIcon} alt="X" /></div>
            
            <div className="title-holder">
                <div
                    className="color-holder"
                    style={schedule.color ? { backgroundColor: schedule.color }: {}}
                >
                    <img src={images.pillIcon} alt="PILL" />
                </div>

                <h2>{schedule.name}</h2>
            </div>

            <div className="info-holder">
                {!schedule.description ? <strong>This schedule doesn't have description.</strong> : <p>{schedule.description}</p>}
            
                <p>Created at: <span>{ExtendedDate.displayDatetime(schedule.created_at)}</span></p>
                {(schedule.created_at !== schedule.updated_at) && <p>Last update: <span>{ExtendedDate.displayDatetime(schedule.updated_at)}</span></p>}
            </div>

            <div className="button-holder">
                <button>
                    <img src={images.penIcon} alt="EDIT" />
                    <span>Edit</span>
                </button>

                <button>
                    <img src={images.deleteIcon} alt="DELETE" />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
}

export default DosesSchedule;