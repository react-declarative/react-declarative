import dayjs from "dayjs";

export const addUtcOffset = (date: dayjs.Dayjs) => {
    const timezoneOffset = new Date().getTimezoneOffset();
    return Math.sign(timezoneOffset) === -1
        ? date.subtract(timezoneOffset, "minutes")
        : date.add(timezoneOffset, "minutes");
};

export default addUtcOffset;
