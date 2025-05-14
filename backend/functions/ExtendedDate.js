const ExtendedDate = {
    monthLengths: [31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    now: () => {
        const date = new Date();

        const year = date.getFullYear();
        const month = leadingZero(date.getMonth() + 1);
        const day = leadingZero(date.getDate());
        const hours = leadingZero(date.getHours());
        const minutes = leadingZero(date.getMinutes());
        const seconds = leadingZero(date.getSeconds());
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    isLeapYear,
    leadingZero
};

function isLeapYear(year) {
    return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
}

function leadingZero(number) {
    if(number >= 10) return number;
    return `0${number}`;
}

module.exports = ExtendedDate;