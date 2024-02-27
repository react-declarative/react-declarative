import dayjs from "dayjs";

export const DIMENSION = "day";
export const GENESIS = "1970-01-01";

export type stamp = number;

export const getMomentStamp = (end = dayjs()): stamp => {
  const start = dayjs(GENESIS);
  return Math.floor(end.diff(start, DIMENSION));
};

export const fromMomentStamp = (stamp: number) => {
  return dayjs(GENESIS).add(stamp, DIMENSION);
};

export default getMomentStamp;
