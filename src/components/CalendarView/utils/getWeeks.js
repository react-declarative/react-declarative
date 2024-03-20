import dayjs from "dayjs";

/**
 * Calculate the weeks between two dates
 *
 * @param minDate - The minimum date
 * @param maxDate - The maximum date
 * @returns An array of weeks between the two dates
 */
export const getWeeks = (minDate, maxDate) => {
  const total = maxDate.diff(minDate, "weeks") + 1;
  const weeks = [];
  for (let i = 0; i !== total; i++) {
    weeks.push(minDate.clone().add(i, "weeks"));
  }
  return weeks;
};

export default getWeeks;
