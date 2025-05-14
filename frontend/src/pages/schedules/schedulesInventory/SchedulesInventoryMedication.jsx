import React, { useState, useEffect, useRef } from "react";
import "./SchedulesInventoryMedication.css";
import Edit from "../../../components/edit/Edit";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const SchedulesInventoryMedication = ({ medication, inventoryMedicationModalRef, disableInventoryMedicationModal, setInfo }) => {
    const [isEditModalActive, setIsEditModalActive] = useState(false);
    const editModalRef = useRef(null);

    useEffect(() => {
        if(isEditModalActive) setTimeout(() => { editModalRef.current.id = "edit-active" }, 10);
    }, [isEditModalActive]);

    function disableEditModal() {
        editModalRef.current.id = "";
        setTimeout(() => setIsEditModalActive(false), 300);
    }
    
    return(
        <div className="schedules-inventory-medication" ref={inventoryMedicationModalRef}>
            {isEditModalActive && <Edit
                type="medication"
                editModalRef={editModalRef}
                disableEditModal={disableEditModal}
                values={medication}
                setForeignInfo={setInfo}
            />}
            
            <div
                className="x-button"
                onClick={disableInventoryMedicationModal}
            ><img src={images.xIcon} alt="X" /></div>

            <div className="title">
                <img src={images.pillIcon} alt="PILL" />
                <h2>{medication.name}</h2>
            </div>

            <div className="info-holder">
                <p>Active substance: <span>{medication.substance}</span></p>
                <p>Amount: <span>{medication.amount} {medication.amount_unit}</span></p>
                <p>Expiration date: <span>{ExtendedDate.display(medication.expiration_date)}</span></p>
                {medication.description && <p className="description">{medication.description}</p>}
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
    );
}

export default SchedulesInventoryMedication;