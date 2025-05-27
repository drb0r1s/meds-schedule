import React, { useState } from "react";
import "./SchedulesCreate.css";
import Loading from "../../../components/loading/Loading";
import { DB } from "../../../functions/DB";
import { CheckInputs } from "../../../functions/CheckInputs";
import { images } from "../../../data/images";

const SchedulesCreate = ({ account, createModalRef, disableCreateModal, setSchedules, setInfo }) => {
    const [inputs, setInputs] = useState({ name: "", description: "", color: "" });
    const [isLoading, setIsLoading] = useState(false);

    async function handleCreate() {
        const isError = CheckInputs.schedule(inputs, setInfo);
        if(isError) return;
        
        setIsLoading(true);
        
        const scheduleResult = await DB.schedule.create({ account_id: account.id, ...inputs });
        
        if(scheduleResult === null || scheduleResult === undefined) return;

        if(scheduleResult.message) {
            setIsLoading(false);
            setInfo({ type: "error", message: scheduleResult.message });

            return;
        }

        const eventResult = await DB.event.create({
            account_id: account.id,
            schedule_id: scheduleResult.id,
            dose_id: null,
            medication_id: null,
            name: "Schedule Created",
            description: "{event.schedule_name} was created.",
            type: "schedule"
        });

        setIsLoading(false);

        if(eventResult === null || eventResult === undefined) return;

        if(eventResult.message) {
            setInfo({ type: "error", message: eventResult.message });
            return;
        }

        setSchedules(prevSchedules => [...prevSchedules, scheduleResult]);
        setInfo({ type: "success", message: `Schedule ${inputs.name} was created successfully!` });
        
        disableCreateModal();
    }

    return(
        <div className="schedules-create" ref={createModalRef}>
            {isLoading && <Loading />}
            
            <button
                className="x-button"
                onClick={disableCreateModal}
            ><img src={images.xIcon} alt="X" /></button>

            <h2>Create a <span>schedule</span></h2>

            <form>
                <div className="form-color">
                    <div
                        className="background"
                        style={inputs.color ? { backgroundColor: inputs.color } : {}}
                    >
                        <img src={images.pillIcon} alt="PILL" />
                    </div>
                    
                    <input
                        type="color"
                        value={inputs.color}
                        onChange={e => setInputs({...inputs, color: e.target.value})}
                    />
                </div>

                <div className="form-info">
                    <fieldset>
                        <input
                            type="text"
                            placeholder="Name"
                            minLength="3"
                            maxLength="64"
                            value={inputs.name}
                            onChange={e => setInputs({...inputs, name: e.target.value})}
                        />
                    </fieldset>

                    <fieldset>
                        <textarea
                            placeholder="Description..."
                            maxLength="320"
                            value={inputs.description}
                            onChange={e => setInputs({...inputs, description: e.target.value})}
                        ></textarea>
                    </fieldset>
                </div>
            </form>

            <button
                className="create-button"
                onClick={handleCreate}
            >Create</button>
        </div>
    );
}

export default SchedulesCreate;