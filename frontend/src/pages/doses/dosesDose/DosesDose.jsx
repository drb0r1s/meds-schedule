import React, { useState, useEffect, useRef } from "react";
import "./DosesDose.css";
import Loading from "../../../components/loading/Loading";
import Edit from "../../../components/edit/Edit";
import Confirmation from "../../../components/confirmation/Confirmation";
import GeneralInfo from "../../../components/generalInfo/GeneralInfo";
import { DB } from "../../../functions/DB";
import { isAdmin } from "../../../functions/isAdmin";
import { ExtendedString } from "../../../functions/ExtendedString";
import { images } from "../../../data/images";

const DosesDose = ({ account, dose, setDose, schedule, dosesDoseModalHolderRef, dosesDoseModalRef, disableDosesDoseModal, setInfo, setDoses }) => {
    const [doseMedications, setDoseMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modals, setModals] = useState({ edit: false, confirmation: false });

    const editModalRef = useRef(null);
    const confirmationModalHolderRef = useRef(null);
    const confirmationModalRef = useRef(null);

    useEffect(() => {
        const getDoseMedications = async () => {
            const result = await DB.doseMedication.get(dose.id, "dose");

            if(result === null || result === undefined) return;
            if(result.message) return;

            setDoseMedications(result);
            setIsLoading(false);
        }

        getDoseMedications();
    }, []);

    useEffect(() => {
        if(modals.edit) setTimeout(() => { if(editModalRef.current) editModalRef.current.id = "edit-active" }, 10);
    }, [modals.edit]);

    useEffect(() => {
        if(modals.confirmation) setTimeout(() => {
            if(!confirmationModalHolderRef.current || !confirmationModalRef.current) return;
            
            confirmationModalHolderRef.current.id = "confirmation-holder-active";
            confirmationModalRef.current.id = "confirmation-active";
        });
    }, [modals.confirmation]);

    function disableEditModal() {
        if(!editModalRef.current) return;

        editModalRef.current.id = "";
        setTimeout(() => setModals({...modals, edit: false}), 300);
    }

    function disableConfirmationModal() {
        if(!confirmationModalRef.current) return;
        confirmationModalRef.current.id = "";

        setTimeout(() => {
            if(!confirmationModalHolderRef.current) return;

            confirmationModalHolderRef.current.id = "";
            setTimeout(() => setModals({...modals, confirmation: false}), 300);
        }, 300);
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

    async function handleButton(type) {
        if(dose.status !== "pending") return;

        if(type === "take") {
            const isError = checkAmount();

            if(isError) {
                setInfo({ type: "error", message: "Not enough medications in the inventory." });
                return;
            }
        }

        setIsLoading(true);
        
        const doseMedicationResult = type === "take" ? await DB.doseMedication.take(dose, doseMedications) : await DB.doseMedication.missed(dose);
        
        if(doseMedicationResult === null || doseMedicationResult === undefined) return;

        if(doseMedicationResult.message) {
            setIsLoading(false);
            setInfo({ type: "error", message: doseMedicationResult.message });

            return;
        }

        const eventResult = await DB.event.create({
            account_id: schedule.account_id,
            schedule_id: schedule.id,
            dose_id: dose.id,
            medication_id: null,
            name: `Dose ${type === "take" ? "Taken" : "Missed"}`,
            description: `{event.dose_name} was marked as ${type === "take" ? "taken" : "missed"}.`,
            type: "dose"
        });
        
        setIsLoading(false);

        if(eventResult === null || eventResult === undefined) return;

        if(eventResult.message) {
            setInfo({ type: "error", message: eventResult.message });
            return;
        }

        const newDose = {...dose, status: type === "take" ? "taken" : "missed"};

        setDose(newDose);

        setDoses(prevDoses => {
            const newDoses = [];

            for(let i = 0; i < prevDoses.length; i++) {
                if(prevDoses[i].id === dose.id) newDoses.push(newDose);
                else newDoses.push(prevDoses[i]);
            }

            return newDoses;
        });

        setInfo({ type: "success", message: `${dose.name} was marked as ${type === "take" ? "taken" : "missed"}.` });
        disableDosesDoseModal();
    }

    async function deleteDose() {
        setIsLoading(true);
        
        const doseResult = await DB.dose.delete(dose.id);

        if(doseResult === null || doseResult === undefined) return;

        if(doseResult.message) {
            setIsLoading(false);
            setInfo({ type: "error", message: doseResult.message });

            return;
        }

        const eventResult = await DB.event.create({
            account_id: schedule.account_id,
            schedule_id: schedule.id,
            dose_id: null,
            medication_id: null,
            name: "Dose Deleted",
            description: `${dose.name} was deleted from the schedule {event.schedule_name}.`,
            type: "dose"
        });

        setIsLoading(false);

        if(eventResult === null || eventResult === undefined) return;
    
        if(eventResult.message) {
            setInfo({ type: "error", message: eventResult.message });
            return;
        }
    
        setInfo({ type: "success", message: `Dose ${dose.name} was deleted successfully!` });
        
        setDoses(prevDoses => {
            const newDoses = prevDoses.filter(prevDose => prevDose.id !== dose.id);
            return newDoses;
        });

        disableDosesDoseModal();
    }
    
    return(
        <div
            className="doses-dose-holder"
            ref={dosesDoseModalHolderRef}
            onClick={e => { if(e.target.classList.contains("doses-dose-holder")) disableDosesDoseModal() }}
        >
            {modals.edit && <Edit
                type="dose"
                editModalRef={editModalRef}
                disableEditModal={disableEditModal}
                values={dose}
                setValues={setDose}
                setForeignInfo={setInfo}
                accountId={schedule.account_id}
            />}

            {modals.confirmation && <Confirmation
                title={`Are you sure you want to delete ${dose.name}?`}
                confirmationModalHolderRef={confirmationModalHolderRef}
                confirmationModalRef={confirmationModalRef}
                disableConfirmationModal={disableConfirmationModal}
                onConfirm={deleteDose}
            />}
            
            <div className="doses-dose" ref={dosesDoseModalRef}>
                {isLoading && <Loading />}
                
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
                
                    <h2>{ExtendedString.cutText(dose.name, 10)}</h2>
                </div>

                <GeneralInfo
                    type="dose"
                    account={account}
                    values={dose}
                />

                <div className="medication-holder">
                    <h3>Your medication{doseMedications.length > 1 ? "s" : ""}:</h3>

                    <div className="list">
                        {doseMedications.map((doseMedication, index) => {
                            return <div key={index} className="medication">
                                <img src={images.pillIcon} alt={doseMedication.name} />

                                <div className="medication-info">
                                    <strong>{ExtendedString.cutText(doseMedication.name, 25)}</strong>
                                    <span>{doseMedication.substance}</span>

                                    <p>Amount to take: <span>{doseMedication.amount_to_take} {doseMedication.amount_unit}</span></p>
                                </div>
                            </div>;
                        })}
                    </div>

                    <div
                        className="button-holder"
                        style={dose.status !== "pending" ? { opacity: .5, position: "static" } : {}}
                    >
                        <button
                            disabled={dose.status !== "pending"}
                            onClick={() => handleButton("take")}
                        >{dose.status === "pending" ? "Take" : dose.status === "taken" ? "Taken" : "Missed"}</button>
                    
                        {dose.status === "pending" && <button
                            className="button-missed"
                            onClick={() => handleButton("missed")}
                        >Missed</button>}
                    </div>
                </div>

                {isAdmin(account) && <div className="menu">
                    <button onClick={() => setModals({...modals, edit: true})}>
                        <img src={images.penIcon} alt="EDIT" />
                        <span>Edit</span>
                    </button>
                        
                    <button onClick={() => setModals({...modals, confirmation: true})}>
                        <img src={images.deleteIcon} alt="DELETE" />
                        <span>Delete</span>
                    </button>
                </div>}
            </div>
        </div>
    );
}

export default DosesDose;