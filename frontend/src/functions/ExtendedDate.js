export const ExtendedDate = {
    monthLengths: [31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    
    display: date => {
        const [year, month, day] = date.split("T")[0].split("-");
        return `${day}.${month}.${year}.`;
    },

    displayDatetime: datetime => {
        const { year, month, day, hours, minutes } = ExtendedDate.parseTime(datetime);
        return `${hours}:${minutes} ${day}.${month}.${year}.`;
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

    isLeapYear
};

function isLeapYear(year) {
    return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
}