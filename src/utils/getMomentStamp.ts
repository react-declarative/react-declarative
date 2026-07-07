import dayjs from "dayjs";

import {
  getMomentStamp as getMomentStampBase,
  fromMomentStamp as fromMomentStampBase,
  type Dimension,
} from "get-moment-stamp";

export type stamp = number;


/**
 * Encodes a moment in time as an integer stamp at the requested granularity:
 * whole `dimension` units (minute | hour | day) elapsed since the Unix epoch,
 * measured on the UTC timeline.
 *
 * The dayjs instant is passed straight through as its absolute epoch value
 * (`end.toDate()`), so the stamp is a pure function of the instant and is
 * identical on any machine regardless of its local timezone. For
 * `dimension: "minute"` consecutive minute candles yield strictly
 * increasing, +1-per-candle stamps — exactly what lightweight-charts needs.
 *
 * @param end - The instant to encode. Defaults to now.
 * @param dimension - Granularity of the axis. Defaults to "day".
 * @returns The stamp for `end` at the given dimension.
 */
export const getMomentStamp = (end: dayjs.Dayjs = dayjs(), dimension: Dimension = "day"): stamp =>
  getMomentStampBase(end.toDate(), dimension);

/**
 * Inverse of {@link getMomentStamp}: reconstructs the instant at the start of
 * the given stamp's `dimension` bucket on the UTC timeline, returned as a
 * dayjs object wrapping that exact epoch instant.
 *
 * @param stamp - The stamp to decode.
 * @param dimension - Granularity the stamp was produced at. Defaults to "day".
 * @returns A dayjs object at the reconstructed instant.
 */
export const fromMomentStamp = (stamp: number, dimension: Dimension = "day") =>
  dayjs(fromMomentStampBase(stamp, dimension));

export default getMomentStamp;
