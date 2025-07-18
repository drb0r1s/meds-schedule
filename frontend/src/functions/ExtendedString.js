export const ExtendedString = {
    toCamelCase: snakeCase => {
        let camelCase = "";
        let high = false;

        for(let i = 0; i < snakeCase.length; i++) {
            if(snakeCase[i] === "_") {
                high = true;
                continue;
            }

            if(high) {
                high = false;
                camelCase += snakeCase[i].toUpperCase();
            }

            else camelCase += snakeCase[i];
        }

        return camelCase;
    },

    parsePlaceholders: (string, event) => {
        let newString = string;
        
        const placeholderRegex = /(?<!\$){[a-zA-Z._]+}/gm;
        const placeholders = newString.match(placeholderRegex);

        if(placeholders === null) return string;
        
        for(let i = 0; i < placeholders.length; i++) {
            // objectProp is string without {}
            const objectProp = placeholders[i].substring(1, placeholders[i].length - 1);
            const prop = objectProp.split(".")[1];

            const value = event[prop] === null ? "<span>DELETED</span>" : ExtendedString.cutText(event[prop], 12);
            newString = newString.replace(placeholders[i], value);
        }

        return newString;
    },

    getDosesURL: (id, name) => {
        const noSpaces = name.replaceAll(" ", "-");
        return `${noSpaces}-${id}`;
    },

    cutText: (text, length) => {
        let newText = text;
        if(text.length > length) newText = `${text.substring(0, length)}...`;

        return newText;
    }
};