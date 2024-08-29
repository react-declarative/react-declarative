export const toUtcDate = (date: Date) => {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1_000);
};

export default toUtcDate;
