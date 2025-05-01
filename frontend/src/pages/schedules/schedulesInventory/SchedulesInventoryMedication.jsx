import React from "react";
import "./SchedulesInventoryMedication.css";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const SchedulesInventoryMedication = ({ medication, inventoryMedicationModalRef, disableInventoryMedicationModal }) => {
    return(
        <div className="schedules-inventory-medication" ref={inventoryMedicationModalRef}>
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

export default SchedulesInventoryMedication;