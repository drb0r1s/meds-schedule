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

    login: async value => {
        return await DB.postRequest(`${DB.URL}family/login`, value);
    },

    loggedIn: async token => {
        return await DB.postRequest(`${DB.URL}family/loggedIn`, { token });
    },
    
    register: async value => {
        return await DB.postRequest(`${DB.URL}family/register`, value);
    }
};