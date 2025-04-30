import React, { useState, useEffect } from "react";
import "./SchedulesInventory.css";
import Loading from "../../../components/loading/Loading";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";

const SchedulesInventory = ({ family, inventoryModalRef, disableInventoryModal }) => {    
    const [medications, setMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noMedications, setNoMedications] = useState(false);

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
    
    return(
        <section className="schedules-inventory" ref={inventoryModalRef}>
            <button
                className="x-button"
                onClick={disableInventoryModal}
            ><img src={images.xIcon} alt="X" /></button>

            <h2>Inventory</h2>

            {isLoading ? <Loading /> : <div className="list">
                {!isLoading && noMedications ? <strong>There are no medications.</strong> : <>
                    
                </>}
            </div>}

            <button className="create-button"><img src={images.plusIcon} alt="CREATE" /></button>
        </section>
    );
}

export default SchedulesInventory;