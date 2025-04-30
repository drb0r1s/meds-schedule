import React, { useState, useEffect } from "react";
import "./SchedulesInventory.css";
import Loading from "../../components/loading/Loading";
import { images } from "../../data/images";

const SchedulesInventory = ({ family, inventoryModalRef, disableInventoryModal }) => {    
    const [medications, setMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noMedications, setNoMedications] = useState(false);

    useEffect(() => {
        const getMedications = async () => {

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

            {isLoading ? <Loading /> : noMedications ? <strong>There are no medications.</strong> : <div className="list">
            
            </div>}
        </section>
    );
}

export default SchedulesInventory;