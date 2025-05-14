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
    }
};