import React, { useState, useEffect, useRef } from "react";
import "./DosesTimeslot.css";
import Info from "../../../components/Info/Info";
import DosesDose from "../dosesDose/DosesDose";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const DosesTimeslot = ({ schedule, timeslot, dosesTimeslotModalRef, disableDosesTimeslotModal, setDoses, dosesMatrix }) => {
    const [id, coordinates] = timeslot;
    const [year, month, day, weekDay, hour] = id.split("-");
    
    const [timeslotDoses, setTimeslotDoses] = useState(dosesMatrix[coordinates.y][coordinates.x]);
    const [dose, setDose] = useState({});
    const [isDoseModalActive, setIsDoseModalActive] = useState(false);
    const [info, setInfo] = useState({ type: "", message: "" });

    const dosesDoseModalHolderRef = useRef(null);    
    const dosesDoseModalRef = useRef(null);

    useEffect(() => {
        setTimeslotDoses(dosesMatrix[coordinates.y][coordinates.x]);
    }, [dosesMatrix]);

    useEffect(() => {
        // Checking !isDoseModalActive ensures that doses are only updated when dose was actually changed (avoiding updating doses while opening dose modal).
        if(!Object.keys(dose).length || !isDoseModalActive) return;

        setDoses(prevDoses => {
            const newDoses = [];

            for(let i = 0; i < prevDoses.length; i++) {
                if(prevDoses[i].id === dose.id) newDoses.push(dose);
                else newDoses.push(prevDoses[i]);
            }

            return newDoses;
        });
    }, [dose]);

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
            setTimeout(() => {
                setDose({});
                setIsDoseModalActive(false);
            }, 300);
        }, 300);
    }
    
    return(
        <div className="doses-timeslot" ref={dosesTimeslotModalRef}>
            {info.message && <Info info={info} setInfo={setInfo} />}
            
            {isDoseModalActive && <DosesDose
                dose={dose}
                setDose={setDose}
                schedule={schedule}
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
                            onClick={() => {
                                setDose(dose);
                                setIsDoseModalActive(true);
                            }}
                        >
                            <img src={images.pillIcon} alt="PILL" />

                            <div className="dose-info">
                                <strong>{dose.name}</strong>
                                
                                <div className="dose-info-time">
                                    <p>{ExtendedDate.display(dose.time, { noDate: true })}</p>
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