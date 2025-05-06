import React, { useState, useEffect, useRef } from "react";
import "./DosesTimeslot.css";
import Info from "../../../components/Info/Info";
import DosesDose from "../dosesDose/DosesDose";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const DosesTimeslot = ({ timeslot, dosesTimeslotModalRef, disableDosesTimeslotModal, setDoses, dosesMatrix }) => {
    const [id, coordinates] = timeslot;
    const [year, month, day, weekDay, hour] = id.split("-");
    
    const [timeslotDoses, setTimeslotDoses] = useState(dosesMatrix[coordinates.y][coordinates.x]);
    const [isDoseModalActive, setIsDoseModalActive] = useState(false);
    const [info, setInfo] = useState({ type: "", message: "" });

    const dosesDoseModalHolderRef = useRef(null);    
    const dosesDoseModalRef = useRef(null);

    useEffect(() => {
        setTimeslotDoses(dosesMatrix[coordinates.y][coordinates.x])
    }, [dosesMatrix]);

    useEffect(() => {
        if(isDoseModalActive) setTimeout(() => {
            dosesDoseModalHolderRef.current.id = "doses-dose-holder-active";
            setTimeout(() => { dosesDoseModalRef.current.id = "doses-dose-active" }, 300);
        }, 10);
    }, [isDoseModalActive]);

    function disableDosesDoseModal() {
        dosesDoseModalRef.current.id = "";
        
        setTimeout(() => {
            dosesDoseModalHolderRef.current.id = "";
            setTimeout(() => setIsDoseModalActive(false), 300);
        }, 300);
    }
    
    return(
        <div className="doses-timeslot" ref={dosesTimeslotModalRef}>
            {info.message && <Info info={info} setInfo={setInfo} />}
            
            {isDoseModalActive && <DosesDose
                dose={isDoseModalActive}
                dosesDoseModalHolderRef={dosesDoseModalHolderRef}
                dosesDoseModalRef={dosesDoseModalRef}
                disableDosesDoseModal={disableDosesDoseModal}
                setInfo={setInfo}
                setDoses={setDoses}
            />}
            
            <button
                className="x-button"
                onClick={disableDosesTimeslotModal}
            ><img src={images.xIcon} alt="X" /></button>

            <h2>Doses for <span>{hour >= 10 ? hour : `0${hour}`}:00 {day}.{parseInt(month) + 1}.{year}.</span></h2>

            <div
                className="list"
                style={!timeslotDoses.length ? { justifyContent: "center" } : {}}
            >
                {!timeslotDoses.length ? <strong>There are no doses.</strong> : <>
                    {timeslotDoses.map((dose, index) => {
                        return <div
                            key={index}
                            className="dose"
                            onClick={() => setIsDoseModalActive(dose)}
                        >
                            <img src={images.pillIcon} alt="PILL" />

                            <div className="dose-info">
                                <strong>{dose.name}</strong>
                                
                                <div className="dose-info-time">
                                    <p>{ExtendedDate.displayDatetime(dose.time, true)}</p>
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