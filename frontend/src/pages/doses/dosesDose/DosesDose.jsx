import React, { useState, useEffect } from "react";
import "./DosesDose.css";
import Loading from "../../../components/loading/Loading";
import Info from "../../../components/Info/Info";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";

const DosesDose = ({ dose, dosesDoseModalHolderRef, dosesDoseModalRef, disableDosesDoseModal }) => {
    const [doseMedications, setDoseMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [info, setInfo] = useState({ type: "", message: "" });

    useEffect(() => {
        const getDoseMedications = async () => {
            const result = await DB.doseMedication.get(dose.id);
            if(result.message) return;

            setDoseMedications(result);
            setIsLoading(false);
        }

        getDoseMedications();
    }, []);

    function checkAmount() {
        let status = false;

        for(let i = 0; i < doseMedications.length; i++) {
            if(doseMedications[i].amount < doseMedications[i].amount_to_take) {
                status = true;
                break;
            }
        }

        return status;
    }

    async function handleTake() {
        const isError = checkAmount();

        if(isError) {
            setInfo({ type: "error", message: "Not enough medications in the inventory." });
            return;
        }

        setIsLoading(true);
        const result = await DB.doseMedication.take(doseMedications);
        setIsLoading(false);

        if(result.message) return;

        setInfo({ type: "success", message: `${dose.name} was marked as taken.` });
    }
    
    return(
        <div
            className="doses-dose-holder"
            ref={dosesDoseModalHolderRef}
            onClick={e => { if(e.target.classList.contains("doses-dose-holder")) disableDosesDoseModal() }}
        >
            <div className="doses-dose" ref={dosesDoseModalRef}>
                {isLoading && <Loading />}
                {info.message && <Info info={info} setInfo={setInfo} />}
                
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

                                    <p>Amount to take: <span>{doseMedication.amount_to_take} {doseMedication.amount_unit}</span></p>
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