export const ExtendedDate = {
    monthLengths: [31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    display: (datetime, props) => {
        const { year, month, day, hours, minutes } = ExtendedDate.parseTime(datetime);
        return `${props?.noTime ? "" : `${leadingZero(hours)}:${leadingZero(minutes)} `}${props?.noDate ? "" : `${leadingZero(day)}.${leadingZero(month)}.${year}.`}`;
    },

    parseTime: string => {
        const date = new Date(string);
        
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return { year, month, day, hours, minutes };
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