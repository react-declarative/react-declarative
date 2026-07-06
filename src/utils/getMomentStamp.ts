import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DIMENSION = "day";
const TIMEZONE = "Europe/London";

export type stamp = number;

/**
 * Calculates the moment stamp based on the given end date and dimension.
 * The stamp is the number of whole `dimension` units elapsed since the Unix
 * epoch as seen on the Europe/London wall clock (DST aware), so the result
 * does not depend on the timezone of the machine running the code.
 *
 * @param [end=dayjs()] - The end date. Defaults to the current date and time.
 * @param [dimension=DIMENSION] - The dimension to calculate the difference in. Defaults to DIMENSION.
 * @returns - The moment stamp representing the difference between the end date and the start date.
 */
export const getMomentStamp = (end = dayjs(), dimension: dayjs.ManipulateType = DIMENSION): stamp => {
  const offsetMinutes = dayjs(end).tz(TIMEZONE).utcOffset();
  const wallClock = dayjs.utc(end.valueOf()).add(offsetMinutes, "minute");
  return Math.floor(wallClock.diff(dayjs.utc(0), dimension, true));
};

/**
 * Converts a moment stamp back to a moment in time.
 * The returned moment points to the start of the given `dimension` unit
 * on the Europe/London wall clock.
 *
 * @param stamp - The timestamp to convert.
 * @param dimension - The dimension to add to the timestamp. Defaults to `DIMENSION`.
 * @returns - The moment in time corresponding to the timestamp.
 */
export const fromMomentStamp = (stamp: number, dimension: dayjs.ManipulateType = DIMENSION) => {
  const wallClock = dayjs.utc(0).add(stamp, dimension);
  return dayjs.tz(wallClock.format("YYYY-MM-DDTHH:mm:ss"), TIMEZONE);
};

export default getMomentStamp;
