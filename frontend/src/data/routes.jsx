import Account from "../pages/account/Account";
import Schedules from "../pages/schedules/Schedules";

export const routes = [
    {
        path: "/",
        element: <Account />
    },

    {
        path: "/schedules",
        element: <Schedules />
    }
];