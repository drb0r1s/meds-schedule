import Account from "../pages/account/Account";
import Schedules from "../pages/schedules/Schedules";
import Doses from "../pages/doses/Doses";

export const routes = [
    {
        path: "/",
        element: <Account />
    },

    {
        path: "/schedules",
        element: <Schedules />
    },

    {
        path: "/schedules/:doses",
        element: <Doses />
    }
];