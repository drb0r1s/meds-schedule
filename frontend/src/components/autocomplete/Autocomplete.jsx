import React, { useState, useEffect } from "react";
import "./Autocomplete.css";
import { medications } from "../../data/medications";

const Autocomplete = ({ isAutocompleteActive, autocompleteRef, input, disableAutocomplete, onSelect }) => {
    const [shownMedications, setShownMedications] = useState([]);

    useEffect(() => {        
        const newShownMedications = [];

        for(let i = 0; i < medications.length; i++) {
            // Setting both medications[i].name and input to lower case letters, for better matching.
            if(medications[i].name.toLowerCase().includes(input.toLowerCase())) newShownMedications.push(medications[i]);
        }

        if(input && !newShownMedications.length) disableAutocomplete();
        
        else {
            if(isAutocompleteActive && autocompleteRef.current && !autocompleteRef.current.id) setTimeout(() => { autocompleteRef.current.id = "autocomplete-active" }, 10);
            setShownMedications(newShownMedications);
        }
    }, [input]);
    
    return(
        <div className="autocomplete" ref={autocompleteRef}>
            {shownMedications.map((shownMedication, index) => {
                return <button
                    key={index}
                    type="button"
                    onClick={() => { disableAutocomplete(); onSelect(shownMedication) }}
                >
                    <p>{shownMedication.name}</p>
                    <span>{shownMedication.substance}</span>
                </button>;
            })}
        </div>
    );
}

export default Autocomplete;