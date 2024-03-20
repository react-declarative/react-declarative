import dayjs from "dayjs";

/**
 * Calculate all the days between a given minimum and maximum date.
 *
 * @param minDate - The minimum date.
 * @param maxDate - The maximum date.
 *
 * @returns An array of Moment objects representing each day between the minimum and maximum date (inclusive).
 */
export const getDays = (minDate, maxDate) => {
  const total = maxDate.diff(minDate, "days") + 1;
  const days = [];
  for (let i = 0; i !== total; i++) {
    days.push(minDate.clone().add(i, "days"));
  }
  return days;
};

export default getDays;
