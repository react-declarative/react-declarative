import dayjs from "dayjs";

const OFFSET_ROUND_MINUTES = 60;

export const addUtcOffset = (date: dayjs.Dayjs) => {
    const timezoneOffset = new Date().getTimezoneOffset();
    return Math.sign(timezoneOffset) === -1
        ? date.add(Math.abs(timezoneOffset) + OFFSET_ROUND_MINUTES, "minutes")
        : date.subtract(Math.abs(timezoneOffset) + OFFSET_ROUND_MINUTES, "minutes");
};

export const removeUtcOffset = (date: dayjs.Dayjs) => {
    const timezoneOffset = new Date().getTimezoneOffset();
    return Math.sign(timezoneOffset) === -1
        ? date.subtract(Math.abs(timezoneOffset) + OFFSET_ROUND_MINUTES, "minutes")
        : date.add(Math.abs(timezoneOffset) + OFFSET_ROUND_MINUTES, "minutes");
};
