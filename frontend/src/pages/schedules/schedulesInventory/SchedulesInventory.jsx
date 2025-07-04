import React, { useState, useEffect, useRef } from "react";
import "./SchedulesInventory.css";
import ScheduleInventoryCreate from "./SchedulesInventoryCreate";
import SchedulesInventoryMedication from "./SchedulesInventoryMedication";
import Loading from "../../../components/loading/Loading";
import Info from "../../../components/Info/Info";
import { DB } from "../../../functions/DB";
import { isAdmin } from "../../../functions/isAdmin";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { ExtendedString } from "../../../functions/ExtendedString";
import { images } from "../../../data/images";

const SchedulesInventory = ({ account, inventoryModalRef, disableInventoryModal }) => {    
    const [medications, setMedications] = useState([]);
    const [medication, setMedication] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [noMedications, setNoMedications] = useState(false);
    const [modals, setModals] = useState({ create: false, medication: false });
    const [info, setInfo] = useState({ type: "", message: "" });

    const inventoryCreateModalRef = useRef(null);
    const inventoryMedicationModalRef = useRef(null);

    useEffect(() => {
        const getMedications = async () => {
            const result = await DB.account.getMedications(account.id);

            if(result === null || result === undefined) return;
            if(result.message) return;

            setMedications(result);
            setIsLoading(false);
            if(!result.length) setNoMedications(true);
        }

        getMedications();
    }, []);

    useEffect(() => {
        if(medications.length && noMedications) setNoMedications(false);
        else if(!medications.length && !noMedications) setNoMedications(true);
    }, [medications]);

    useEffect(() => {
        // Checking !modals.medication ensures that medications are only updated when medication was actually changed (avoiding updating medications while opening medication modal).
        if(!Object.keys(medication).length || !modals.medication) return;

        const newMedications = [];

        for(let i = 0; i < medications.length; i++) {
            if(medications[i].id === medication.id) newMedications.push(medication);
            else newMedications.push(medications[i]);
        }

        setMedications(newMedications);
    }, [medication]);

    useEffect(() => {
        if(modals.create) setTimeout(() => { if(inventoryCreateModalRef.current) inventoryCreateModalRef.current.id = "schedules-inventory-create-active" }, 10);
    }, [modals.create]);

    useEffect(() => {
        if(modals.medication) setTimeout(() => { if(inventoryMedicationModalRef.current) inventoryMedicationModalRef.current.id = "schedules-inventory-medication-active" }, 10);
    }, [modals.medication]);

    function disableInventoryCreateModal() {
        if(!inventoryCreateModalRef.current) return;
        
        inventoryCreateModalRef.current.id = "";
        setTimeout(() => setModals({...modals, create: false}), 300);
    }

    function disableInventoryMedicationModal() {
        if(!inventoryMedicationModalRef.current) return;
        
        inventoryMedicationModalRef.current.id = "";
        
        setTimeout(() => {
            setMedication({});
            setModals({...modals, medication: false});
        }, 300);
    }
    
    return(
        <section className="schedules-inventory" ref={inventoryModalRef}>
            {info.message && <Info info={info} setInfo={setInfo} />}
            
            {modals.create && <ScheduleInventoryCreate
                account={account}
                inventoryCreateModalRef={inventoryCreateModalRef}
                disableInventoryCreateModal={disableInventoryCreateModal}
                info={info}
                setInfo={setInfo}
                setMedications={setMedications}
            />}

            {modals.medication && <SchedulesInventoryMedication
                account={account}
                medication={medication}
                setMedication={setMedication}
                inventoryMedicationModalRef={inventoryMedicationModalRef}
                disableInventoryMedicationModal={disableInventoryMedicationModal}
                setInfo={setInfo}
                setMedications={setMedications}
            />}
            
            <button
                className="x-button"
                onClick={disableInventoryModal}
            ><img src={images.xIcon} alt="X" /></button>

            <h2>Inventory</h2>

            {isLoading ? <Loading /> : <div
                className="list"
                style={noMedications ? { justifyContent: "center" } : {}}
            >
                {!isLoading && noMedications ? <strong>There are no medications.</strong> : <>
                    {medications.map((medication, index) => {
                        return <div
                            key={index}
                            className="medication"
                            onClick={() => {
                                setMedication(medication);
                                setModals({...modals, medication: true});
                            }}
                        >
                            <img src={images.pillIcon} alt={medication.name} />

                            <div className="info-holder">
                                <strong>{ExtendedString.cutText(medication.name, 20)}</strong>
                                <span>{medication.substance}</span>

                                <div className="info-inner-holder">
                                    {medication.amount < 5 && <img src={medication.amount === 0 ? images.warningRedIcon : images.warningIcon} alt="WARNING" />}
                                    <p>Amount: <span>{medication.amount} {medication.amount_unit}</span></p>
                                    <p>Expiration date: <span>{ExtendedDate.display(medication.expiration_date, { noTime: true })}</span></p>
                                </div>
                            </div>
                        </div>;
                    })}
                </>}
            </div>}

            {isAdmin(account) && !isLoading && <button
                className="create-button"
                onClick={() => setModals({...modals, create: true})}
            ><img src={images.plusIcon} alt="CREATE" /></button>}
        </section>
    );
}

export default SchedulesInventory;