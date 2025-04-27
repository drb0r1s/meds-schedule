const ExtendedDate = {
    now: () => {
        const date = new Date();

        // .toISOString() - converts Date() object value to an ISO string, for better formatting.
        // .slice(0, 19) - takes only first 19 characters (excluding miliseconds).
        // .replace("T", " ") - replaces T created by .toISOString() with space character, for better formatting.
        return date.toISOString().slice(0, 19).replace("T", " ");
    }
};

module.exports = ExtendedDate;