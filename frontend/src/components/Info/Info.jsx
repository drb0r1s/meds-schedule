import React, { useEffect, useRef } from "react";
import "./Info.css";
import { images } from "../../data/images";

const Info = ({ type, message }) => {
    const infoRef = useRef(null);
    const lineRef = useRef(null);

    let interval;

    useEffect(() => {
        setTimeout(() => { infoRef.current.id = "info-active" }, 10);
        
        interval = setInterval(() => {
            const lineRefWidth = parseInt(getComputedStyle(lineRef.current).getPropertyValue("width"));
            
            if(lineRefWidth <= 0) disableInfo();
            else lineRef.current.style.width = `${lineRefWidth - 1}px`;
        }, 10);

        return () => { clearInterval(interval) }
    }, []);

    function disableInfo() {
        infoRef.current.id = "";
        clearInterval(interval);
    }
    
    return(
        <div className={`info info-${type}`} ref={infoRef}>
            <div className="line" ref={lineRef}></div>
            
            <div className="content-holder">
                <div className="button-holder">
                    <button onClick={disableInfo}><img src={images.xIcon} alt="X" /></button>
                </div>

                <p>{message}</p>
            </div>
        </div>
    );
}

export default Info;