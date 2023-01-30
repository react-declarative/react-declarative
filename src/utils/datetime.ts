import dayjs from 'dayjs';

export const DATE_PLACEHOLDER = 'DD/MM/YYYY';
export const TIME_PLACEHOLDER = 'HH:MM';

export const DATE_EXPR = /(?:\d\d\/\d\d\/\d\d\d\d)/g;
export const TIME_EXPR = /(?:\d\d:\d\d)/g;

export class Time {
    constructor(
        public readonly hour: number,
        public readonly minute: number
    ) { }
    toString = () => {
        return serializeTime(this);
    };
    toStamp = () => {
        return this.hour * 60 + this.minute;
    };
};

export class Date {
    constructor(
        public readonly day: number,
        public readonly month: number,
        public readonly year: number,
    ) { }
    toString = () => {
        return serializeDate(this);
    };
    toStamp = () => {
        const start = dayjs('1970-01-01');
        const now = dayjs();
        now.set('date', this.day);
        now.set('month', this.month - 1);
        now.set('year', this.year);
        if (now.isValid()) {
            return Math.max(now.diff(start, 'day'), -1);
        } else {
            return -1;
        }
    };
};

export const parseDate = (date: string): Date | null => {
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

export const serializeDate = (date: Date) => {
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

export const serializeTime = (time: Time) => {
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

export const currentDate = () => {
    const now = new window.Date();
    const date = new Date(now.getDate(), now.getMonth() + 1, now.getFullYear());
    return serializeDate(date);
};

export const currentTime = () => {
    const now = new window.Date();
    const time = new Time(now.getHours(), now.getMinutes());
    return serializeTime(time);
};

export const timeStamp = (str: string) => {
    const time = parseTime(str);
    if (time) {
        return time.toStamp();
    } else {
        return -1;
    }
};

export const dateStamp = (str: string) => {
    const date = parseDate(str);
    if (date) {
        return date.toStamp();
    } else {
        return -1;
    }
};
