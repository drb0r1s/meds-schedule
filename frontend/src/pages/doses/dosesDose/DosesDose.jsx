import React, { useState, useEffect } from "react";
import "./DosesDose.css";
import Loading from "../../../components/loading/Loading";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";

const DosesDose = ({ dose, dosesDoseModalHolderRef, dosesDoseModalRef, disableDosesDoseModal }) => {
    const [doseMedicine, setDoseMedicine] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getDoseMedicine = async () => {
            const result = await DB.doseMedication.get(dose.id);
            if(result.message) return;

            console.log(result);
            setIsLoading(false);
        }

        getDoseMedicine();
    }, []);
    
    return(
        <div
            className="doses-dose-holder"
            ref={dosesDoseModalHolderRef}
            onClick={e => { if(e.target.classList.contains("doses-dose-holder")) disableDosesDoseModal() }}
        >
            <div className="doses-dose" ref={dosesDoseModalRef}>
                {isLoading && <Loading />}
                
                <button
                    className="x-button"
                    onClick={disableDosesDoseModal}
                ><img src={images.xIcon} alt="X" /></button>

                <h2>{dose.name}</h2>
            </div>
        </div>
    );
}

export default DosesDose;