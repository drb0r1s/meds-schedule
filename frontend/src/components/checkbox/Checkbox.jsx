import React from "react";
import "./Checkbox.css";
import { images } from "../../data/images";

const Checkbox = ({ title, value, setValue }) => {
    return(
        <div className="checkbox-holder" onClick={() => setValue(!value)}>
            <div className={`checkbox ${value && "checkbox-active"}`}>
                {value && <img src={images.checkIcon} alt="CHECK" />}
            </div>

            <p>{title}</p>
        </div>
    );
}

export default Checkbox;