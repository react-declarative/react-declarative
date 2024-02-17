import dayjs from "dayjs";

export const getMonthLabels = () => {
  const localeData = dayjs.localeData();
  const months = localeData.months();
  const monthsShort = localeData.monthsShort();
  const result = monthsShort || months;
  return result.map(
    (month) => `${month.slice(0, 1).toUpperCase()}${month.slice(1, 3)}`
  );
};

export default getMonthLabels;
