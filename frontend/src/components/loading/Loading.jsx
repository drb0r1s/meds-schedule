import React from "react";
import "./Loading.css";

const Loading = ({ style }) => {
    return(
        <div className="loading-holder" style={style}>
            <div className="loading">
                <div className="top"></div>
                <div className="bottom"></div>
            </div>
        </div>
    );
}

export default Loading;