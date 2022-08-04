import dayjs from "dayjs";

export const DATE_TEMPLATE = 'DD.MM.YYYY';
export const TIME_TEMPLATE = 'HH:MM';

export class Time {
    constructor(
        public readonly hour: number,
        public readonly minute: number
    ) { }
    toString = () => {
        return serializeTime(this);
    };
};

export const parseDate = (str: string): dayjs.Dayjs | null => {
    const result = dayjs(str, DATE_TEMPLATE);
    if (result.isValid()) {
        return result;
    }
    return null;
};

export const serializeDate = (date: Date | dayjs.Dayjs) => {
    const result = dayjs(date);
    if (result.isValid()) {
        return result.format(DATE_TEMPLATE);
    }
    return null;
};

export const parseTime = (time: string): Time | null => {
    const [hour, minute] = time.split(':')
    if (hour && minute) {
        const h = parseInt(hour);
        const m = parseInt(minute);
        if (isNaN(h) || isNaN(m)) {
            return null;
        }
        return new Time(h, m);
    }
    return null;
};

export const serializeTime = (time: Time | Date | dayjs.Dayjs) => {
    let hour = '';
    let minute = '';
    if (dayjs.isDayjs(time)) {
        if (!time.isValid()) {
            return null;
        }
        hour = time.get('hour').toString();
        minute = time.get('minute').toString();
    } else if (time instanceof Date) {
        if (!isFinite(Number(time))) {
            return null;
        }
        hour = time.getHours().toString();
        minute = time.getMinutes().toString();
    } else if (time instanceof Time) {
        hour = time.hour.toString();
        minute = time.minute.toString();
    } else {
        return null;
    }
    hour = hour.length === 1 ? '0' + hour : hour;
    minute = minute.length === 1 ? '0' + minute : minute;
    return `${hour}:${minute}`;
};
