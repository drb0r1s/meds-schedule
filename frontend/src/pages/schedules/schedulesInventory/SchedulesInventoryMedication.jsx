import React, { useState, useEffect, useRef } from "react";
import "./SchedulesInventoryMedication.css";
import Loading from "../../../components/loading/Loading";
import Edit from "../../../components/edit/Edit";
import Confirmation from "../../../components/confirmation/Confirmation";
import GeneralInfo from "../../../components/generalInfo/GeneralInfo";
import { DB } from "../../../functions/DB";
import { isAdmin } from "../../../functions/isAdmin";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { ExtendedString } from "../../../functions/ExtendedString";
import { images } from "../../../data/images";

const SchedulesInventoryMedication = ({ account, medication, setMedication, inventoryMedicationModalRef, disableInventoryMedicationModal, setInfo, setMedications }) => {
    const [modals, setModals] = useState({ edit: false, confirmation: false });
    const [isLoading, setIsLoading] = useState(false);

    const editModalRef = useRef(null);
    const confirmationModalHolderRef = useRef(null);
    const confirmationModalRef = useRef(null);

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

    async function deleteMedication() {
        setIsLoading(true);

        const doseMedicationResult = await DB.doseMedication.get(medication.id, "medication");

        if(doseMedicationResult === null || doseMedicationResult === undefined) return;

        if(doseMedicationResult.message) {
            setIsLoading(false);
            setInfo({ type: "error", message: doseMedicationResult.message });

            return;
        }

        const doseIds = [];
        for(let i = 0; i < doseMedicationResult.length; i++) doseIds.push(doseMedicationResult[i].dose_id);

        if(doseIds.length) {
            const doseResult = await DB.dose.deleteMultiple(doseIds);
            if(doseResult === null || doseResult === undefined) return;

            if(doseResult.message) {
                setIsLoading(false);
                setInfo({ type: "error", message: doseResult.message });

                return;
            }
        }

        const medicationResult = await DB.medication.delete(medication.id);

        if(medicationResult === null || medicationResult === undefined) return;

        if(medicationResult.message) {
            setIsLoading(false);
            setInfo({ type: "error", message: medicationResult.message });

            return;
        }

        const eventResult = await DB.event.create({
            account_id: medication.account_id,
            schedule_id: null,
            dose_id: null,
            medication_id: null,
            name: "Medication Deleted",
            description: `${medication.name} was deleted.`,
            type: "medication"
        });

        setIsLoading(false);

        if(eventResult === null || eventResult === undefined) return;

        if(eventResult.message) {
            setInfo({ type: "error", message: eventResult.message });
            return;
        }
    
        setInfo({ type: "success", message: `Medication ${medication.name} was deleted successfully!` });
        
        setMedications(prevMedications => {
            const newMedications = prevMedications.filter(prevMedication => prevMedication.id !== medication.id);
            return newMedications;
        });

        disableInventoryMedicationModal();
    }
    
    return(
        <div className="schedules-inventory-medication" ref={inventoryMedicationModalRef}>
            {isLoading && <Loading />}
            
            {modals.edit && <Edit
                type="medication"
                editModalRef={editModalRef}
                disableEditModal={disableEditModal}
                values={medication}
                setValues={setMedication}
                setForeignInfo={setInfo}
            />}

            {modals.confirmation && <Confirmation
                title={`Are you sure you want to delete ${medication.name}?`}
                confirmationModalHolderRef={confirmationModalHolderRef}
                confirmationModalRef={confirmationModalRef}
                disableConfirmationModal={disableConfirmationModal}
                onConfirm={deleteMedication}
            />}
            
            <div
                className="x-button"
                onClick={disableInventoryMedicationModal}
            ><img src={images.xIcon} alt="X" /></div>

            <div className="medication-info-holder">
                <div className="title">
                    <img src={images.pillIcon} alt="PILL" />
                    <h2>{ExtendedString.cutText(medication.name, 10)}</h2>
                </div>

                <div className="info-holder">
                    <p>Active substance: <span>{medication.substance}</span></p>
                    <p>Amount: <span>{medication.amount} {medication.amount_unit}</span></p>
                    <p>Expiration date: <span>{ExtendedDate.display(medication.expiration_date, { noTime: true })}</span></p>
                
                    <GeneralInfo
                        type="medication"
                        account={account}
                        values={medication}
                    />
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

export default SchedulesInventoryMedication;