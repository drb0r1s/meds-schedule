import React from "react";
import "./Checkbox.css";
import { images } from "../../data/images";

const Checkbox = ({ title, value, setValue, onCheck, isChecked }) => {
    return(
        <div className="checkbox-holder" onClick={onCheck ? onCheck : () => setValue(!value)}>
            <div className={`checkbox ${isChecked && "checkbox-active"}`}>
                {isChecked && <img src={images.checkIcon} alt="CHECK" />}
            </div>

            <p>{title}</p>
        </div>
    );
}

export default Checkbox;