import dayjs from 'dayjs';
import getGenesisStamp from './getGenesisStamp';

export const DATE_PLACEHOLDER = 'DD/MM/YYYY';
export const TIME_PLACEHOLDER = 'HH:MM';

export const DATE_EXPR = /(?:\d\d\/\d\d\/\d\d\d\d)/g;
export const TIME_EXPR = /(?:\d\d:\d\d)/g;

/**
 * Represents a specific point in time.
 */
export class Time {
    constructor(
        public readonly hour: number,
        public readonly minute: number
    ) { }
    /**
     * Converts the object to a string representation.
     *
     * @returns The string representation of the object.
     */
    toString = () => {
        return serializeTime(this);
    };
    /**
     * Calculates the total minutes represented by the hour and minute properties of an object.
     *
     * @returns The total minutes represented by the hour and minute properties.
     */
    toStamp = () => {
        return this.hour * 60 + this.minute;
    };
    /**
     * Takes a stamp value and converts it into a Time object.
     *
     * @param stamp - The stamp value representing minutes since 1970-01-01 00:00.
     * @returns - The Time object representing the hour and minute derived from the stamp value.
     */
    static fromStamp = (stamp: number | null) => {
        if (stamp === null) {
            return null;
        }
        const source = dayjs(new window.Date(0)).set("hour", 0).set("minute", 0).add(stamp, "minute");
        const hour = source.get('hour');
        const minute = source.get('minute');
        return new Time(hour, minute);
    };
};

/**
 * Represents a date.
 */
export class Date {
    constructor(
        public readonly day: number,
        public readonly month: number,
        public readonly year: number,
    ) { }
    /**
     * Returns a string representation of the current object.
     *
     * @return The serialized string representation of the object.
     */
    toString = () => {
        return serializeDate(this);
    };
    /**
     * Calculates the number of days from 1970-01-01 to a specified date.
     *
     * @returns The number of days from 1970-01-01 to the specified date.
     */
    toStamp = () => {
        const start = getGenesisStamp();
        let now = dayjs().set('hour', 0);
        now = now.set('date', this.day);
        now = now.set('month', this.month - 1);
        now = now.set('year', this.year);
        if (now.isValid()) {
            return Math.max(Math.floor(now.diff(start, 'day', true)), -1);
        } else {
            return -1;
        }
    };
    /**
     * Converts a stamp value to a date object.
     *
     * @param stamp - The number of days since '1970-01-01' to convert.
     * @returns - The converted date object.
     */
    static fromStamp = (stamp: number | null) => {
        if (stamp === null) {
            return null;
        }
        const now = getGenesisStamp().add(stamp, 'days').toDate();
        return new Date(now.getDate(), now.getMonth() + 1, now.getFullYear());
    };
};

/**
 * Parses a string representation of a date in "dd/mm/yyyy" format and returns a Date object.
 * If the input is not in the correct format or is null, returns null.
 *
 * @param date - The string representation of the date to parse.
 * @returns - The parsed Date object or null if the input is not valid.
 */
export const parseDate = (date: string | null): Date | null => {
    if (!date) {
        return null;
    }
    const [day = '', month = '', year = ''] = date.split('/');
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      const d = parseInt(day, 10);
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) {
        return null;
      }
      return new Date(d, m, y);
    }
    return null;
};

/**
 * Serialize a given date to a string representation in the format "dd/MM/yyyy".
 *
 * @param date - The date to serialize.
 * @returns The serialized date or null if the input is not a valid Date object.
 */
export const serializeDate = (date: Date | null) => {
    let day = '';
    let month = '';
    let year = '';
    if (date instanceof Date) {
        day = date.day.toString();
        month = date.month.toString();
        year = date.year.toString();
    } else {
        return null;
    }
    day = day.length === 1 ? '0' + day : day;
    month = month.length === 1 ? '0' + month : month;
    return `${day}/${month}/${year}`;
};

/**
 * Parses a string representation of time into a Time object.
 *
 * @param time - The string representation of time to parse.
 * @returns - The parsed Time object or null if input is null or invalid.
 */
export const parseTime = (time: string | null): Time | null => {
    if (!time) {
        return null;
    }
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

/**
 * Serializes the given time object into a string representation.
 *
 * @param time - The time object to be serialized.
 * @returns - The serialized time string, or null if the input is invalid.
 */
export const serializeTime = (time: Time | null) => {
    let hour = '';
    let minute = '';
    if (time instanceof Time) {
        hour = time.hour.toString();
        minute = time.minute.toString();
    } else {
        return null;
    }
    hour = hour.length === 1 ? '0' + hour : hour;
    minute = minute.length === 1 ? '0' + minute : minute;
    return `${hour}:${minute}`;
};

/**
 * Retrieves the current date.
 *
 * @returns The current date in serialized format.
 */
export const currentDate = () => {
    const now = new window.Date();
    const date = new Date(now.getDate(), now.getMonth() + 1, now.getFullYear());
    return serializeDate(date)!;
};

/**
 * Generates the current time.
 *
 * @returns The current time as a serialized string.
 */
export const currentTime = () => {
    const now = new window.Date();
    const time = new Time(now.getHours(), now.getMinutes());
    return serializeTime(time)!;
};

/**
 * Converts a string representation of a time to a timestamp.
 *
 * @param [str] - The time string to convert. Defaults to the current time.
 * @returns - The timestamp representation of the given time or -1 if conversion fails.
 */
export const timeStamp = (str = currentTime()) => {
    const time = parseTime(str);
    if (time) {
        return time.toStamp();
    } else {
        return -1;
    }
};

/**
 * Converts a date string to a timestamp.
 *
 * @param [str=currentDate()] - The date string to convert.
 * @returns - The timestamp if the conversion is successful, -1 otherwise.
 */
export const dateStamp = (str = currentDate()) => {
    const date = parseDate(str);
    if (date) {
        return date.toStamp();
    } else {
        return -1;
    }
};
