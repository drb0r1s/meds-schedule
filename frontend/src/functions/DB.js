export const DB = {
    URL: "http://88.200.63.148:9999/",

    postRequest: async (URL, value) => {
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: value
            });
    
            const result = await response.json();
            return result;
        }

        catch(err) {
            console.error(`ERROR: ${err}`);
        }
    },
    
    register: async value => {
        await DB.postRequest(`${DB.URL}/family/register`, value);
    }
};