export const ExtendedDate = {
    monthLengths: [31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    
    display: date => {
        const [year, month, day] = date.split("T")[0].split("-");
        return `${day}.${month}.${year}.`;
    },

    displayDatetime: datetime => {
        const { year, month, day, hours, minutes } = ExtendedDate.parseSQL(datetime);
        return `${hours}:${minutes} ${day}.${month}.${year}.`;
    },

    parseSQL: string => {
        const parsed = new Date(string).toISOString().slice(0, 19).replace("T", " ");
        const [year, month, other] = parsed.split("-");
        const [day, time] = other.split(" ");
        const [hours, minutes] = time.split(":");

        return { year: parseInt(year), month: parseInt(month), day: parseInt(day), hours: parseInt(hours), minutes: parseInt(minutes) };
    },

    isLeapYear
};

function isLeapYear(year) {
    return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
}