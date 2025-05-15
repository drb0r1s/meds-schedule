import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DosesSchedule.css";
import Loading from "../../../components/loading/Loading";
import Edit from "../../../components/edit/Edit";
import GeneralInfo from "../../../components/generalInfo/GeneralInfo";
import Confirmation from "../../../components/confirmation/Confirmation";
import { DB } from "../../../functions/DB";
import { images } from "../../../data/images";

const DosesSchedule = ({ schedule, dosesScheduleModalRef, disableDosesScheduleModal, setInfo }) => {
    const [modals, setModals] = useState({ edit: false, confirmation: false });
    const [isLoading, setIsLoading] = useState(false);

    const editModalRef = useRef(null);
    const confirmationModalHolderRef = useRef(null);
    const confirmationModalRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if(modals.edit) setTimeout(() => { editModalRef.current.id = "edit-active" }, 10);
    }, [modals.edit]);

    useEffect(() => {
        if(modals.confirmation) setTimeout(() => {
            confirmationModalHolderRef.current.id = "confirmation-holder-active";
            confirmationModalRef.current.id = "confirmation-active";
        });
    }, [modals.confirmation]);

    function disableEditModal() {
        editModalRef.current.id = "";
        setTimeout(() => setModals({...modals, edit: false}), 300);
    }

    function disableConfirmationModal() {
        confirmationModalRef.current.id = "";

        setTimeout(() => {
            confirmationModalHolderRef.current.id = "";
            setTimeout(() => setModals({...modals, confirmation: false}), 300);
        }, 300);
    }

    async function deleteSchedule() {
        setIsLoading(true);
        const result = await DB.schedule.delete(schedule.id);
        setIsLoading(false);

        if(result.message) return;

        setInfo({ type: "success", message: `Schedule ${schedule.name} was deleted successfully!` });
        navigate("/schedules");
    }
    
    return(
        <div className="doses-schedule" ref={dosesScheduleModalRef}>
            {isLoading && <Loading />}
            
            {modals.edit && <Edit
                type="schedule"
                editModalRef={editModalRef}
                disableEditModal={disableEditModal}
                values={schedule}
                setForeignInfo={setInfo}
            />}

            {modals.confirmation && <Confirmation
                title={`Are you sure you want to delete ${schedule.name} schedule?`}
                confirmationModalHolderRef={confirmationModalHolderRef}
                confirmationModalRef={confirmationModalRef}
                disableConfirmationModal={disableConfirmationModal}
                onConfirm={deleteSchedule}
            />}
            
            <div
                className="x-button"
                onClick={disableDosesScheduleModal}
            ><img src={images.xIcon} alt="X" /></div>
            
            <div className="schedule-info-holder">
                <div className="title-holder">
                    <div
                        className="color-holder"
                        style={schedule.color ? { backgroundColor: schedule.color }: {}}
                    >
                        <img src={images.pillIcon} alt="PILL" />
                    </div>

                    <h2>{schedule.name}</h2>
                </div>

                <GeneralInfo type="schedule" values={schedule} />

                <div className="button-holder">
                    <button onClick={() => setModals({...modals, edit: true})}>
                        <img src={images.penIcon} alt="EDIT" />
                        <span>Edit</span>
                    </button>

                    <button onClick={() => setModals({...modals, confirmation: true})}>
                        <img src={images.deleteIcon} alt="DELETE" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DosesSchedule;