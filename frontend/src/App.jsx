import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./data/routes";

const App = () => {
    const router = createBrowserRouter(routes);
    
    return(
        <RouterProvider router={router} />
    );
}

export default App;