import dayjs from "dayjs";

export const getWeekLabels = () => {
  const localeData = dayjs.localeData();
  const weekdays = localeData.weekdays();
  const weekdaysShort = localeData.weekdaysShort();
  const { weekStart = 0 } = dayjs.Ls[dayjs.locale()];
  const days = weekdaysShort || weekdays;
  const result = [...days.slice(weekStart, 7), ...days.slice(0, weekStart)];
  return result.map(
    (day) => `${day.slice(0, 1).toUpperCase()}${day.slice(1, 3)}`
  );
};

export default getWeekLabels;
