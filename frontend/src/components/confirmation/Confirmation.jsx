import React from "react";
import "./Confirmation.css";

const Confirmation = ({ title, confirmationModalHolderRef, confirmationModalRef, disableConfirmationModal, onConfirm }) => {
    return(
        <div
            className="confirmation-holder"
            ref={confirmationModalHolderRef}
            onClick={e => { if(e.target.classList.contains("confirmation-holder")) disableConfirmationModal() }}
        >
            <div className="confirmation" ref={confirmationModalRef}>
                <strong>{title}</strong>

                <div className="confirmation-buttons">
                    <button onClick={() => { disableConfirmationModal(); onConfirm() }}>Yes</button>
                    <button onClick={disableConfirmationModal}>No</button>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;