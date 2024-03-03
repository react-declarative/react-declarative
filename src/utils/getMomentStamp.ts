import dayjs from "dayjs";

export const DIMENSION = "day";
export const GENESIS = "1970-01-01";

export type stamp = number;

export const getMomentStamp = (end = dayjs(), dimension: dayjs.ManipulateType = DIMENSION): stamp => {
  const start = dayjs(GENESIS);
  return Math.floor(end.diff(start, dimension));
};

export const fromMomentStamp = (stamp: number, dimension: dayjs.ManipulateType = DIMENSION) => {
  return dayjs(GENESIS).add(stamp, dimension);
};

export default getMomentStamp;
