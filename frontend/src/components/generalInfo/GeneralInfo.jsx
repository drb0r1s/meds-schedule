import React from "react";
import "./GeneralInfo.css";
import { ExtendedDate } from "../../functions/ExtendedDate";
import { isAdmin } from "../../functions/isAdmin";

const GeneralInfo = ({ type, account, values, style }) => {
    return (
        <div
            className="general-info"
            style={style}
        >
            {!values.description ? <strong>This {type} doesn't have a description.</strong> : <p className="general-info-description">{values.description}</p>}

            {isAdmin(account) && <>
                <p>Created at: <span>{ExtendedDate.display(values.created_at)}</span></p>
                {(values.created_at !== values.updated_at) && <p>Last update: <span>{ExtendedDate.display(values.updated_at)}</span></p>}
            </>}
        </div>
    );
}

export default GeneralInfo;