const ExtendedDate = {
    monthLengths: [31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    now: () => {
        const date = new Date();

        // .toISOString() - converts Date() object value to an ISO string, for better formatting.
        // .slice(0, 19) - takes only first 19 characters (excluding miliseconds).
        // .replace("T", " ") - replaces T created by .toISOString() with space character, for better formatting.
        return date.toISOString().slice(0, 19).replace("T", " ");
    },

    isLeapYear
};

function isLeapYear(year) {
    return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
}

module.exports = ExtendedDate;