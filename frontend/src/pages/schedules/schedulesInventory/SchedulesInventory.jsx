import React, { useState, useEffect, useRef } from "react";
import "./SchedulesInventory.css";
import ScheduleInventoryCreate from "./SchedulesInventoryCreate";
import Loading from "../../../components/loading/Loading";
import Info from "../../../components/Info/Info";
import { DB } from "../../../functions/DB";
import { ExtendedDate } from "../../../functions/ExtendedDate";
import { images } from "../../../data/images";

const SchedulesInventory = ({ family, inventoryModalRef, disableInventoryModal }) => {    
    const [medications, setMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noMedications, setNoMedications] = useState(false);
    const [isCreateModalActive, setIsCreateModalActive] = useState(false);
    const [info, setInfo] = useState({ type: "", message: "" });

    const inventoryCreateModalRef = useRef(null);

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
        if(isCreateModalActive) setTimeout(() => { inventoryCreateModalRef.current.id = "schedules-inventory-create-active" }, 10);
    }, [isCreateModalActive]);

    function disableInventoryCreateModal() {
        inventoryCreateModalRef.current.id = "";
        setTimeout(() => setIsCreateModalActive(false), 300);
    }
    
    return(
        <section className="schedules-inventory" ref={inventoryModalRef}>
            {info.message && <Info info={info} setInfo={setInfo} />}
            
            {isCreateModalActive && <ScheduleInventoryCreate
                family={family}
                inventoryCreateModalRef={inventoryCreateModalRef}
                disableInventoryCreateModal={disableInventoryCreateModal}
                info={info}
                setInfo={setInfo}
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
                onClick={() => setIsCreateModalActive(true)}
            ><img src={images.plusIcon} alt="CREATE" /></button>
        </section>
    );
}

export default SchedulesInventory;