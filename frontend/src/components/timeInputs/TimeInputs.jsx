import React from "react";
import "./TimeInputs.css";

const TimeInputs = ({ inputs, setInputs }) => {
    return(
        <fieldset className="time-inputs">
            <div className="time-inputs-first">
                <input
                    type="number"
                    placeholder="HH"
                    min="0"
                    max="23"
                    minLength="1"
                    maxLength="2"
                    value={inputs.time.hours}
                    onChange={e => setInputs({ ...inputs, time: { ...inputs.time, hours: e.target.value } })}
                />

                <span>:</span>

                <input
                    type="number"
                    placeholder="MM"
                    min="0"
                    max="59"
                    minLength="1"
                    maxLength="2"
                    value={inputs.time.minutes}
                    onChange={e => setInputs({ ...inputs, time: { ...inputs.time, minutes: e.target.value } })}
                />
            </div>

            <div className="time-inputs-second">
                <input
                    type="number"
                    placeholder="DD"
                    min="1"
                    max="31"
                    minLength="1"
                    maxLength="2"
                    value={inputs.time.day}
                    onChange={e => setInputs({ ...inputs, time: { ...inputs.time, day: e.target.value } })}
                />

                <input
                    type="number"
                    placeholder="MM"
                    min="1"
                    max="12"
                    minLength="1"
                    maxLength="2"
                    value={inputs.time.month}
                    onChange={e => setInputs({ ...inputs, time: { ...inputs.time, month: e.target.value } })}
                />

                <input
                    type="number"
                    placeholder="YYYY"
                    min="2025"
                    max="2030"
                    minLength="4"
                    maxLength="4"
                    value={inputs.time.year}
                    onChange={e => setInputs({ ...inputs, time: { ...inputs.time, year: e.target.value } })}
                />
            </div>
        </fieldset>
    );
}

export default TimeInputs;