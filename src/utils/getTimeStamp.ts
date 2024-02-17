import dayjs from "dayjs";

export const getTimeStamp = (source = dayjs()) => {
  const hour = source.get("hour");
  const minute = source.get("minute");
  return hour * 60 + minute;
};

export const fromTimeStamp = (stamp: number) => {
  const genesis = dayjs().set("hour", 0).set("minute", 0);
  return genesis.add(stamp, "minute");
};

export default getTimeStamp;
