import React, { useState, useEffect, useRef } from "react";
import "./SchedulesInventory.css";
import ScheduleInventoryCreate from "./SchedulesInventoryCreate";
import SchedulesInventoryMedication from "./SchedulesInventoryMedication";
import Loading from "../../../components/loading/Loading";
import Info from "../../../components/Info/Info";
import { DB } from "../../../functions/DB";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const SchedulesInventory = ({ family, inventoryModalRef, disableInventoryModal }) => {    
    const [medications, setMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noMedications, setNoMedications] = useState(false);
    const [modals, setModals] = useState({ create: false, medication: false });
    const [info, setInfo] = useState({ type: "", message: "" });

    const inventoryCreateModalRef = useRef(null);
    const inventoryMedicationModalRef = useRef(null);

    useEffect(() => {
        const getMedications = async () => {
            const result = await DB.family.getMedications(family.id);
            if(result.message) return;

            setMedications(result);
            setIsLoading(false);
            if(!result.length) setNoMedications(true);
        }

        getMedications();
    }, []);

    useEffect(() => {
        if(modals.create) setTimeout(() => { inventoryCreateModalRef.current.id = "schedules-inventory-create-active" }, 10);
    }, [modals.create]);

    useEffect(() => {
        if(modals.medication) setTimeout(() => { inventoryMedicationModalRef.current.id = "schedules-inventory-medication-active" }, 10);
    }, [modals.medication]);

    function disableInventoryCreateModal() {
        inventoryCreateModalRef.current.id = "";
        setTimeout(() => setModals({...modals, create: false}), 300);
    }

    function disableInventoryMedicationModal() {
        inventoryMedicationModalRef.current.id = "";
        setTimeout(() => setModals({...modals, medication: false}), 300);
    }
    
    return(
        <section className="schedules-inventory" ref={inventoryModalRef}>
            {info.message && <Info info={info} setInfo={setInfo} />}
            
            {modals.create && <ScheduleInventoryCreate
                family={family}
                inventoryCreateModalRef={inventoryCreateModalRef}
                disableInventoryCreateModal={disableInventoryCreateModal}
                info={info}
                setInfo={setInfo}
                setMedications={setMedications}
            />}

            {modals.medication && <SchedulesInventoryMedication
                medication={modals.medication}
                inventoryMedicationModalRef={inventoryMedicationModalRef}
                disableInventoryMedicationModal={disableInventoryMedicationModal}
            />}
            
            <button
                className="x-button"
                onClick={disableInventoryModal}
            ><img src={images.xIcon} alt="X" /></button>

            <h2>Inventory</h2>

            {isLoading ? <Loading /> : <div className="list">
                {!isLoading && noMedications ? <strong>There are no medications.</strong> : <>
                    {medications.map((medication, index) => {
                        return <div
                            key={index}
                            className="medication"
                            onClick={() => setModals({...modals, medication})}
                        >
                            <img src={images.pillIcon} alt={medication.name} />

                            <div className="info-holder">
                                <strong>{medication.name}</strong>
                                <span>{medication.substance}</span>

                                <div className="info-inner-holder">
                                    <p>Amount: <span>{medication.amount} {medication.amount_unit}</span></p>
                                    <p>Expiration date: <span>{ExtendedDate.display(medication.expiration_date)}</span></p>
                                </div>
                            </div>
                        </div>;
                    })}
                </>}
            </div>}

            <button
                className="create-button"
                onClick={() => setModals({...modals, create: true})}
            ><img src={images.plusIcon} alt="CREATE" /></button>
        </section>
    );
}

export default SchedulesInventory;