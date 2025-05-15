import React, { useState, useEffect, useRef } from "react";
import "./DosesDose.css";
import Loading from "../../../components/loading/Loading";
import Edit from "../../../components/edit/Edit";
import GeneralInfo from "../../../components/generalInfo/GeneralInfo";
import { DB } from "../../../functions/DB";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const DosesDose = ({ dose, dosesDoseModalHolderRef, dosesDoseModalRef, disableDosesDoseModal, setInfo, setDoses }) => {
    const [doseMedications, setDoseMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalActive, setIsEditModalActive] = useState(false);

    const editModalRef = useRef(null);

    useEffect(() => {
        const getDoseMedications = async () => {
            const result = await DB.doseMedication.get(dose.id);
            if(result.message) return;

            setDoseMedications(result);
            setIsLoading(false);
        }

        getDoseMedications();
    }, []);

    useEffect(() => {
        if(isEditModalActive) setTimeout(() => { editModalRef.current.id = "edit-active" }, 10);
    }, [isEditModalActive]);

    function disableEditModal() {
        editModalRef.current.id = "";
        setTimeout(() => setIsEditModalActive(false), 300);
    }

    function checkAmount() {
        let status = false;

        for(let i = 0; i < doseMedications.length; i++) {
            if(doseMedications[i].amount < doseMedications[i].amount_to_take) {
                status = true;
                break;
            }
        }

        return status;
    }

    async function handleTake() {
        if(dose.status !== "pending") return;
        
        const isError = checkAmount();

        if(isError) {
            setInfo({ type: "error", message: "Not enough medications in the inventory." });
            return;
        }

        setIsLoading(true);

        const doseMedicationResult = await DB.doseMedication.take(dose, doseMedications);
        if(doseMedicationResult.message) return;

        const doseResult = await DB.schedule.getDoses(dose.schedule_id);
        if(doseResult.message) return;

        setIsLoading(false);

        setDoses(doseResult);

        setInfo({ type: "success", message: `${dose.name} was marked as taken.` });
        disableDosesDoseModal();
    }
    
    return(
        <div
            className="doses-dose-holder"
            ref={dosesDoseModalHolderRef}
            onClick={e => { if(e.target.classList.contains("doses-dose-holder")) disableDosesDoseModal() }}
        >
            <div className="doses-dose" ref={dosesDoseModalRef}>
                {isLoading && <Loading />}

                {isEditModalActive && <Edit
                    type="dose"
                    editModalRef={editModalRef}
                    disableEditModal={disableEditModal}
                    values={dose}
                    setForeignInfo={setInfo}
                />}
                
                <div className="title-holder">
                    <button
                        className="x-button"
                        onClick={disableDosesDoseModal}
                    ><img src={images.xIcon} alt="X" /></button>
                    
                    <div
                        className="color-holder"
                        style={dose.color ? { backgroundColor: dose.color }: {}}
                    >
                        <img src={images.pillIcon} alt="PILL" />
                    </div>
                
                    <h2>{dose.name}</h2>
                </div>

                <GeneralInfo type="dose" values={dose} />

                <div className="medication-holder">
                    <h3>Your medication{doseMedications.length > 1 ? "s" : ""}:</h3>

                    <div className="list">
                        {doseMedications.map((doseMedication, index) => {
                            return <div key={index} className="medication">
                                <img src={images.pillIcon} alt={doseMedication.name} />

                                <div className="medication-info">
                                    <strong>{doseMedication.name}</strong>
                                    <span>{doseMedication.substance}</span>

                                    <p>Amount to take: <span>{doseMedication.amount_to_take} {doseMedication.amount_unit}</span></p>
                                </div>
                            </div>;
                        })}
                    </div>

                    <button
                        style={dose.status !== "pending" ? { opacity: .5, position: "static" } : {}}
                        disabled={dose.status !== "pending"}
                        onClick={handleTake}
                    >{dose.status === "pending" ? "Take" : dose.status === "taken" ? "Taken" : "Missed"}</button>
                </div>

                <div className="menu">
                    <button onClick={() => setIsEditModalActive(true)}>
                        <img src={images.penIcon} alt="EDIT" />
                        <span>Edit</span>
                    </button>
                        
                    <button>
                        <img src={images.deleteIcon} alt="DELETE" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DosesDose;