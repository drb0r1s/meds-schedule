import React, { useState, useEffect, useRef } from "react";
import "./SchedulesInventory.css";
import ScheduleInventoryCreate from "./SchedulesInventoryCreate";
import Loading from "../../../components/loading/Loading";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";

const SchedulesInventory = ({ family, inventoryModalRef, disableInventoryModal }) => {    
    const [medications, setMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noMedications, setNoMedications] = useState(false);
    const [isCreateModalActive, setIsCreateModalActive] = useState(false);
    const [createInputs, setCreateInputs] = useState({ name: "", description: "", substance: "", expirationDate: "", amount: "", amountUnit: "" });

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
            {isCreateModalActive && <ScheduleInventoryCreate
                inventoryCreateModalRef={inventoryCreateModalRef}
                createInputs={createInputs}
                setCreateInputs={setCreateInputs}
                disableInventoryCreateModal={disableInventoryCreateModal}
            />}
            
            <button
                className="x-button"
                onClick={disableInventoryModal}
            ><img src={images.xIcon} alt="X" /></button>

            <h2>Inventory</h2>

            {isLoading ? <Loading /> : <div className="list">
                {!isLoading && noMedications ? <strong>There are no medications.</strong> : <>
                    
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