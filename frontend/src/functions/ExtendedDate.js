export const ExtendedDate = {
    monthLengths: [31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    
    display: date => {
        const [year, month, day] = date.split("T")[0].split("-");
        return `${day}.${month}.${year}`;
    },

    isLeapYear
};

function isLeapYear(year) {
    return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
}