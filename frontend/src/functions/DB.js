export const DB = {
    URL: "http://88.200.63.148:9999/",

    getRequest: async URL => {
        try {
            const response = await fetch(URL);

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
                body: JSON.stringify(value)
            });
    
            const result = await response.json();
            return result;
        } catch(err) {
            console.error(`ERROR: ${err}`);
        }
    },

    family: {
        login: async value => {
            return await DB.postRequest(`${DB.URL}family/login`, value);
        },
    
        loggedIn: async token => {
            return await DB.postRequest(`${DB.URL}family/loggedIn`, { token });
        },
        
        register: async value => {
            return await DB.postRequest(`${DB.URL}family/register`, value);
        },

        update: async (id, value) => {
            return await DB.postRequest(`${DB.URL}family/update`, { id, value });
        },

        getSchedules: async id => {
            return await DB.postRequest(`${DB.URL}family/get-schedules`, { id });
        },

        getMedications: async id => {
            return await DB.postRequest(`${DB.URL}family/get-medications`, { id });
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

        checkExistence: async (family_id, medications) => {
            return await DB.postRequest(`${DB.URL}medication/check-existence`, { family_id, medications });
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

        getAll: async family_id => {
            return await DB.postRequest(`${DB.URL}event/get-all`, { family_id });
        }
    }
};