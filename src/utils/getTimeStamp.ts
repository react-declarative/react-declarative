import dayjs from "dayjs";

import {
  getTimeStamp as getTimeStampBase,
  fromTimeStamp as fromTimeStampBase,
} from "get-moment-stamp";

/**
 * Calculates the timestamp in minutes based on the wall-clock time of the
 * given source. The hour and minute components are normalized to UTC before
 * being passed to `get-moment-stamp`, so the result depends only on the
 * wall-clock time and not on the timezone of the machine running the code.
 *
 * @param [source=dayjs()] - The source date and time. Defaults to the current date and time.
 * @returns - The timestamp in minutes.
 */
export const getTimeStamp = (source: dayjs.Dayjs = dayjs()) =>
  getTimeStampBase(new Date(Date.UTC(1970, 0, 1, source.hour(), source.minute())));

/**
 * Converts a timestamp in minutes back to a date and time: today with the
 * hour and minute taken from the timestamp.
 *
 * @param stamp - The timestamp to convert.
 * @returns The date and time corresponding to the given timestamp.
 */
export const fromTimeStamp = (stamp: number) => {
  const date = fromTimeStampBase(stamp, new Date(0));
  return dayjs().set("hour", date.getUTCHours()).set("minute", date.getUTCMinutes());
};

export default getTimeStamp;
