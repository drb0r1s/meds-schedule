import React from "react";

const AmountInputs = ({ inputs, setInputs }) => {
    const amountUnits = ["mg", "g", "mcg", "ml", "l", "pills", "capsules", "drops", "patches", "inhalations", "other"];
    
    return (
        <>
            <fieldset>
                <input
                    type="number"
                    placeholder="Amount"
                    min="1"
                    max="10"
                    value={inputs.amount}
                    onChange={e => setInputs({ ...inputs, amount: e.target.value })}
                />
            </fieldset>

            <fieldset>
                <select
                    value={inputs.amountUnit}
                    onChange={e => setInputs({ ...inputs, amountUnit: e.target.value })}
                >
                    <option value="">Amount Unit</option>

                    {amountUnits.map((amountUnit, index) => {
                        return <option
                            key={index}
                            value={amountUnit}
                        >{amountUnit}</option>;
                    })}
                </select>
            </fieldset>
        </>
    );
}

export default AmountInputs;