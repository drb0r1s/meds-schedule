import React from "react";
import "./ExpirationDateInputs.css";

const ExpirationDateInputs = ({ inputs, setInputs }) => {
    return (
        <fieldset className="expiration-date-inputs">
            <input
                type="number"
                placeholder="DD"
                min="1"
                max="31"
                minLength="1"
                maxLength="2"
                value={inputs.expirationDate.day}
                onChange={e => setInputs({ ...inputs, expirationDate: { ...inputs.expirationDate, day: e.target.value } })}
            />

            <input
                type="number"
                placeholder="MM"
                min="1"
                max="12"
                minLength="1"
                maxLength="2"
                value={inputs.expirationDate.month}
                onChange={e => setInputs({ ...inputs, expirationDate: { ...inputs.expirationDate, month: e.target.value } })}
            />

            <input
                type="number"
                placeholder="YYYY"
                min="2025"
                max="2030"
                minLength="4"
                maxLength="4"
                value={inputs.expirationDate.year}
                onChange={e => setInputs({ ...inputs, expirationDate: { ...inputs.expirationDate, year: e.target.value } })}
            />
        </fieldset>
    );
}

export default ExpirationDateInputs;