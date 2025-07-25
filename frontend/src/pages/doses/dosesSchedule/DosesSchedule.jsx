import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DosesSchedule.css";
import Loading from "../../../components/loading/Loading";
import Edit from "../../../components/edit/Edit";
import GeneralInfo from "../../../components/generalInfo/GeneralInfo";
import Confirmation from "../../../components/confirmation/Confirmation";
import { DB } from "../../../functions/DB";
import { isAdmin } from "../../../functions/isAdmin";
import { ExtendedString } from "../../../functions/ExtendedString";
import { images } from "../../../data/images";

const DosesSchedule = ({ account, schedule, setSchedule, dosesScheduleModalRef, disableDosesScheduleModal, setInfo }) => {
    const [modals, setModals] = useState({ edit: false, confirmation: false });
    const [isLoading, setIsLoading] = useState(false);

    const editModalRef = useRef(null);
    const confirmationModalHolderRef = useRef(null);
    const confirmationModalRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if(modals.edit) setTimeout(() => { if(editModalRef.current) editModalRef.current.id = "edit-active" }, 10);
    }, [modals.edit]);

    useEffect(() => {
        if(modals.confirmation) setTimeout(() => {
            if(!confirmationModalHolderRef.current || !confirmationModalRef.current) return;
            
            confirmationModalHolderRef.current.id = "confirmation-holder-active";
            confirmationModalRef.current.id = "confirmation-active";
        });
    }, [modals.confirmation]);

    function disableEditModal() {
        if(!editModalRef.current) return;
        
        editModalRef.current.id = "";
        setTimeout(() => setModals({...modals, edit: false}), 300);
    }

    function disableConfirmationModal() {
        if(!confirmationModalRef.current) return;
        confirmationModalRef.current.id = "";

        setTimeout(() => {
            if(!confirmationModalHolderRef.current) return;
            
            confirmationModalHolderRef.current.id = "";
            setTimeout(() => setModals({...modals, confirmation: false}), 300);
        }, 300);
    }

    async function deleteSchedule() {
        setIsLoading(true);
        
        const scheduleResult = await DB.schedule.delete(schedule.id);

        if(scheduleResult === null || scheduleResult === undefined) return;

        if(scheduleResult.message) {
            setIsLoading(false);
            setInfo({ type: "error", message: scheduleResult.message });

            return;
        }

        const eventResult = await DB.event.create({
            account_id: schedule.account_id,
            schedule_id: null,
            dose_id: null,
            medication_id: null,
            name: "Schedule Deleted",
            description: `${schedule.name} was deleted.`,
            type: "schedule"
        });
        
        setIsLoading(false);

        if(eventResult === null || eventResult === undefined) return;

        if(eventResult.message) {
            setInfo({ type: "error", message: eventResult.message });
            return;
        }

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
                setValues={setSchedule}
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

                    <h2>{ExtendedString.cutText(schedule.name, 15)}</h2>
                </div>

                <GeneralInfo
                    type="schedule"
                    account={account}
                    values={schedule}
                />

                {isAdmin(account) && <div className="button-holder">
                    <button onClick={() => setModals({...modals, edit: true})}>
                        <img src={images.penIcon} alt="EDIT" />
                        <span>Edit</span>
                    </button>

                    <button onClick={() => setModals({...modals, confirmation: true})}>
                        <img src={images.deleteIcon} alt="DELETE" />
                        <span>Delete</span>
                    </button>
                </div>}
            </div>
        </div>
    );
}

export default DosesSchedule;