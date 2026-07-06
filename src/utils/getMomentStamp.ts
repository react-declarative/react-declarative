import dayjs from "dayjs";

import {
  getMomentStamp as getMomentStampBase,
  fromMomentStamp as fromMomentStampBase,
} from "get-moment-stamp";

export type stamp = number;

/**
 * Calculates the moment stamp for the given end date: the number of whole
 * days since the Unix epoch for the calendar date of `end`.
 *
 * The wall-clock date components of the dayjs object are normalized to UTC
 * before being passed to `get-moment-stamp`, so the result depends only on
 * the calendar date and not on the timezone of the machine running the code.
 *
 * @param [end=dayjs()] - The end date. Defaults to the current date and time.
 * @returns - The moment stamp for the calendar date of `end`.
 */
export const getMomentStamp = (end: dayjs.Dayjs = dayjs()): stamp =>
  getMomentStampBase(new Date(Date.UTC(end.year(), end.month(), end.date())));

/**
 * Converts a moment stamp back to a moment in time: the start of the
 * corresponding calendar date in the local timezone.
 *
 * @param stamp - The moment stamp to convert.
 * @returns - The dayjs object pointing to the start of the calendar date.
 */
export const fromMomentStamp = (stamp: number) => {
  const date = fromMomentStampBase(stamp);
  return dayjs(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

export default getMomentStamp;
