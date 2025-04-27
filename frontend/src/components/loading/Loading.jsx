import React from "react";
import "./Loading.css";

const Loading = () => {
    return(
        <div className="loading-holder">
            <div className="loading">
                <div className="top"></div>
                <div className="bottom"></div>
            </div>
        </div>
    );
}

export default Loading;