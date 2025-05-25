import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Unavailable from "./components/unavailable/Unavailable";
import { routes } from "./data/routes";

const App = () => {
    const router = createBrowserRouter(routes);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        window.addEventListener("resize", checkIsMobile);
        return () => { window.removeEventListener("resize", checkIsMobile) }
    }, []);

    function checkIsMobile() {
        setIsMobile(window.innerWidth <= 768);
    }
    
    return(
        <>
            {isMobile ? <RouterProvider router={router} /> : <Unavailable />}
        </>
    );
}

export default App;