import dayjs from "dayjs";

export const DIMENSION = "day";
export const GENESIS = "1970-01-01";

export type stamp = number;

/**
 * Calculates the moment stamp based on the given end date and dimension.
 * The moment stamp represents the difference between the end date and the start date in the specified dimension.
 *
 * @param {dayjs.Dayjs} [end=dayjs()] - The end date. Defaults to the current date and time.
 * @param {dayjs.ManipulateType} [dimension=DIMENSION] - The dimension to calculate the difference in. Defaults to DIMENSION.
 * @returns {number} - The moment stamp representing the difference between the end date and the start date.
 */
export const getMomentStamp = (end = dayjs(), dimension: dayjs.ManipulateType = DIMENSION): stamp => {
  const start = dayjs(GENESIS);
  return Math.floor(end.diff(start, dimension));
};

/**
 * Converts a timestamp to a moment in time.
 *
 * @param {number} stamp - The timestamp to convert.
 * @param {dayjs.ManipulateType} dimension - The dimension to add to the timestamp. Defaults to `DIMENSION`.
 * @returns {dayjs.Dayjs} - The moment in time corresponding to the timestamp.
 */
export const fromMomentStamp = (stamp: number, dimension: dayjs.ManipulateType = DIMENSION) => {
  return dayjs(GENESIS).add(stamp, dimension);
};

export default getMomentStamp;
