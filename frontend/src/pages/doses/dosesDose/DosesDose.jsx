import React, { useState, useEffect } from "react";
import "./DosesDose.css";
import Loading from "../../../components/loading/Loading";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";

const DosesDose = ({ dose, dosesDoseModalHolderRef, dosesDoseModalRef, disableDosesDoseModal }) => {
    const [doseMedications, setDoseMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getDoseMedications = async () => {
            const result = await DB.doseMedication.get(dose.id);
            if(result.message) return;

            setDoseMedications(result);
            setIsLoading(false);
        }

        getDoseMedications();
    }, []);

    async function handleTake() {
        console.log(doseMedications)
    }
    
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

                <div className="medication-holder">
                    <h3>Your medication{doseMedications.length > 1 ? "s" : ""}:</h3>

                    <div className="list">
                        {doseMedications.map((doseMedication, index) => {
                            return <div key={index} className="medication">
                                <img src={images.pillIcon} alt={doseMedication.name} />

                                <div className="medication-info">
                                    <strong>{doseMedication.name}</strong>
                                    <span>{doseMedication.substance}</span>

                                    <p>Amount to take: <span>{doseMedication.amount} {doseMedication.amount_unit}</span></p>
                                </div>
                            </div>;
                        })}
                    </div>

                    <button onClick={handleTake}>Take</button>
                </div>
            </div>
        </div>
    );
}

export default DosesDose;