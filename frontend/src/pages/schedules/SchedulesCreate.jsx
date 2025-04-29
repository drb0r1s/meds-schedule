import React, { useState } from "react";
import "./SchedulesCreate.css";
import Loading from "../../components/loading/Loading";
import { DB } from "../../functions/DB";
import { images } from "../../data/images";

const SchedulesCreate = ({ family, createModalRef, disableCreateModal }) => {
    const [inputs, setInputs] = useState({ name: "", description: "", color: "" });
    const [isLoading, setIsLoading] = useState(false);

    async function handleCreate() {
        setIsLoading(true);
        const result = await DB.schedule.create({ family_id: family.id, ...inputs });
        setIsLoading(false);

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
                        className="color-background"
                        style={inputs.color ? { backgroundColor: inputs.color } : {}}
                    ></div>
                    
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