export const DB = {
    URL: "http://88.200.63.148:9999/",

    request: async (method, URL, value) => {
        const props = {
            method,
            credentials: "include"
        };
        
        const additionalProps = {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value)
        };

        const fetchProps = method === "get" ? props : {...props, ...additionalProps};
        
        try {
            const response = await fetch(URL, fetchProps);
            const result = await response.json();

            return result;
        } catch(err) {
            console.error(`ERROR: ${err}`);
        }
    },

    account: {
        login: async value => {
            return await DB.request("POST", `${DB.URL}account/login`, value);
        },

        logout: async () => {
            return await DB.request("GET", `${DB.URL}account/logout`);
        },
    
        loggedIn: async () => {
            return await DB.request("GET", `${DB.URL}account/logged-in`);
        },
        
        register: async value => {
            return await DB.request("POST", `${DB.URL}account/register`, value);
        },

        adminLogin: async (id, adminPassword) => {
            return await DB.request("POST", `${DB.URL}account/admin-login`, { id, adminPassword });
        },

        update: async (id, value) => {
            return await DB.request("PATCH", `${DB.URL}account/update`, { id, value });
        },

        getSchedules: async id => {
            return await DB.request("GET", `${DB.URL}account/${id}/get-schedules`);
        },

        getMedications: async id => {
            return await DB.request("GET", `${DB.URL}account/${id}/get-medications`);
        },

        getNotifications: async id => {
            return await DB.request("GET", `${DB.URL}account/${id}/get-notifications`);
        }
    },

    schedule: {
        get: async id => {
            return await DB.request("GET", `${DB.URL}schedule/${id}/get`);
        },
        
        create: async value => {
            return await DB.request("POST", `${DB.URL}schedule/create`, value);
        },

        update: async (id, value) => {
            return await DB.request("PATCH", `${DB.URL}schedule/update`, { id, value });
        },

        delete: async id => {
            return await DB.request("DELETE", `${DB.URL}schedule/${id}/delete`);
        },

        getDoses: async id => {
            return await DB.request("GET", `${DB.URL}schedule/${id}/get-doses`);
        }
    },

    dose: {
        create: async value => {
            return await DB.request("POST", `${DB.URL}dose/create`, value);
        },

        update: async (id, value) => {
            return await DB.request("PATCH", `${DB.URL}dose/update`, { id, value });
        },

        delete: async id => {
            return await DB.request("DELETE", `${DB.URL}dose/${id}/delete`);
        },

        deleteMultiple: async ids => {
            return await DB.request("POST", `${DB.URL}dose/delete-multiple`, { ids });
        }
    },

    medication: {
        create: async value => {
            return await DB.request("POST", `${DB.URL}medication/create`, value);
        },

        update: async (id, value) => {
            return await DB.request("PATCH", `${DB.URL}medication/update`, { id, value });
        },

        delete: async id => {
            return await DB.request("DELETE", `${DB.URL}medication/${id}/delete`);
        },

        checkExistence: async (account_id, medications) => {
            return await DB.request("POST", `${DB.URL}medication/check-existence`, { account_id, medications });
        }
    },

    doseMedication: {
        get: async (id, type) => {
            return await DB.request("GET", `${DB.URL}dose-medication/${id}/${type}/get`);
        },
        
        create: async value => {
            return await DB.request("POST", `${DB.URL}dose-medication/create`, value);
        },

        take: async (dose, doseMedications) => {
            return await DB.request("POST", `${DB.URL}dose-medication/take`, { dose, doseMedications });
        },

        missed: async dose => {
            return await DB.request("POST", `${DB.URL}dose-medication/missed`, { dose });
        }
    },

    event: {
        create: async value => {
            return await DB.request("POST", `${DB.URL}event/create`, { value });
        },

        getAll: async account_id => {
            return await DB.request("GET", `${DB.URL}event/${account_id}/get-all`);
        }
    }
};