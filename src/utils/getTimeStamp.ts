import dayjs from "dayjs";

/**
 * Retrieves the timestamp from the given source.
 * If no source is provided, the current timestamp is used.
 *
 * @param {Object} [source] - The source object to retrieve the timestamp from. Defaults to current time.
 * @returns {number} - The timestamp in minutes.
 */
export const getTimeStamp = (source = dayjs()) => {
  const hour = source.get("hour");
  const minute = source.get("minute");
  return hour * 60 + minute;
};

/**
 * Converts a timestamp to a date and time using dayjs library.
 * @param {number} stamp - The timestamp to convert.
 * @returns {Date} The date and time corresponding to the given timestamp.
 */
export const fromTimeStamp = (stamp: number) => {
  const genesis = dayjs().set("hour", 0).set("minute", 0);
  return genesis.add(stamp, "minute");
};

export default getTimeStamp;
