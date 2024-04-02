import dayjs from "dayjs";

/**
 * Calculates the timestamp in minutes based on the given source.
 *
 * @param [source] - The source date and time. Defaults to the current date and time.
 * @returns - The timestamp in minutes.
 */
export const getTimeStamp = (source = dayjs()) => {
  const hour = source.get("hour");
  const minute = source.get("minute");
  return hour * 60 + minute;
};

/**
 * Converts a timestamp to a date and time using dayjs library.
 * @param stamp - The timestamp to convert.
 * @returns The date and time corresponding to the given timestamp.
 */
export const fromTimeStamp = (stamp: number) => {
  const genesis = dayjs().set("hour", 0).set("minute", 0);
  return genesis.add(stamp, "minute");
};

export default getTimeStamp;
