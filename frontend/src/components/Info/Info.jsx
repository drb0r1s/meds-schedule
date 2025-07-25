import React, { useEffect, useRef } from "react";
import "./Info.css";
import { images } from "../../data/images";

const Info = ({ info, setInfo }) => {
    const infoRef = useRef(null);
    const lineRef = useRef(null);

    let interval;

    useEffect(() => {
        setTimeout(() => { if(infoRef.current) infoRef.current.id = "info-active" }, 10);
        
        interval = setInterval(() => {
            if(!lineRef.current) return;
            
            const lineRefWidth = parseInt(getComputedStyle(lineRef.current).getPropertyValue("width"));
            
            if(lineRefWidth <= 0) disableInfo();
            else lineRef.current.style.width = `${lineRefWidth - 1}px`;
        }, 10);

        return () => { clearInterval(interval) }
    }, []);

    function disableInfo() {
        if(!infoRef.current) return;
        
        infoRef.current.id = "";
        clearInterval(interval);

        setTimeout(() => setInfo({ type: "", message: "" }), 300);
    }
    
    return(
        <div className={`info info-${info.type}`} ref={infoRef}>
            <div className="line" ref={lineRef}></div>
            
            <div className="content-holder">
                <div className="button-holder">
                    <button onClick={disableInfo}><img src={images.xIcon} alt="X" /></button>
                </div>

                <p>{info.message}</p>
            </div>
        </div>
    );
}

export default Info;