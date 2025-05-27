export const DB = {
    URL: "http://88.200.63.148:9999/",

    getRequest: async URL => {
        try {
            const response = await fetch(URL, { credentials: "include" });
            const result = await response.json();

            return result;
        } catch(err) {
            console.error(`ERROR: ${err}`);
        }
    },

    postRequest: async (URL, value) => {        
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(value),
                credentials: "include"
            });
    
            const result = await response.json();
            return result;
        } catch(err) {
            console.error(`ERROR: ${err}`);
        }
    },

    account: {
        login: async value => {
            return await DB.postRequest(`${DB.URL}account/login`, value);
        },

        logout: async () => {
            return await DB.getRequest(`${DB.URL}account/logout`);
        },
    
        loggedIn: async () => {
            return await DB.getRequest(`${DB.URL}account/logged-in`);
        },
        
        register: async value => {
            return await DB.postRequest(`${DB.URL}account/register`, value);
        },

        adminLogin: async (id, adminPassword) => {
            return await DB.postRequest(`${DB.URL}account/admin-login`, { id, adminPassword });
        },

        update: async (id, value) => {
            return await DB.postRequest(`${DB.URL}account/update`, { id, value });
        },

        getSchedules: async id => {
            return await DB.postRequest(`${DB.URL}account/get-schedules`, { id });
        },

        getMedications: async id => {
            return await DB.postRequest(`${DB.URL}account/get-medications`, { id });
        },

        getNotifications: async id => {
            return await DB.postRequest(`${DB.URL}account/get-notifications`, { id });
        }
    },

    schedule: {
        get: async id => {
            return await DB.postRequest(`${DB.URL}schedule/get`, { id });
        },
        
        create: async value => {
            return await DB.postRequest(`${DB.URL}schedule/create`, value);
        },

        update: async (id, value) => {
            return await DB.postRequest(`${DB.URL}schedule/update`, { id, value });
        },

        delete: async id => {
            return await DB.postRequest(`${DB.URL}schedule/delete`, { id });
        },

        getDoses: async id => {
            return await DB.postRequest(`${DB.URL}schedule/get-doses`, { id });
        }
    },

    dose: {
        create: async value => {
            return await DB.postRequest(`${DB.URL}dose/create`, value);
        },

        update: async (id, value) => {
            return await DB.postRequest(`${DB.URL}dose/update`, { id, value });
        },

        delete: async id => {
            return await DB.postRequest(`${DB.URL}dose/delete`, { id });
        },

        deleteMultiple: async ids => {
            return await DB.postRequest(`${DB.URL}dose/delete-multiple`, { ids });
        }
    },

    medication: {
        create: async value => {
            return await DB.postRequest(`${DB.URL}medication/create`, value);
        },

        update: async (id, value) => {
            return await DB.postRequest(`${DB.URL}medication/update`, { id, value });
        },

        delete: async id => {
            return await DB.postRequest(`${DB.URL}medication/delete`, { id });
        },

        checkExistence: async (account_id, medications) => {
            return await DB.postRequest(`${DB.URL}medication/check-existence`, { account_id, medications });
        }
    },

    doseMedication: {
        get: async (id, type) => {
            return await DB.postRequest(`${DB.URL}dose-medication/get`, { id, type });
        },
        
        create: async value => {
            return await DB.postRequest(`${DB.URL}dose-medication/create`, value);
        },

        take: async (dose, doseMedications) => {
            return await DB.postRequest(`${DB.URL}dose-medication/take`, { dose, doseMedications });
        },

        missed: async dose => {
            return await DB.postRequest(`${DB.URL}dose-medication/missed`, { dose });
        }
    },

    event: {
        create: async value => {
            return await DB.postRequest(`${DB.URL}event/create`, { value });
        },

        getAll: async account_id => {
            return await DB.postRequest(`${DB.URL}event/get-all`, { account_id });
        }
    }
};