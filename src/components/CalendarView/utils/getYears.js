import dayjs from "dayjs";

/**
 * Function to get an array of years between a minimum and maximum date.
 *
 * @param minDate - The minimum date.
 * @param maxDate - The maximum date.
 * @returns An array of years between the minimum and maximum date (inclusive).
 */
export const getYears = (minDate, maxDate) => {
  const total = maxDate.diff(minDate, "years") + 1;
  const years = [];
  for (let i = 0; i !== total; i++) {
    years.push(minDate.clone().add(i, "years"));
  }
  return years;
};

export default getYears;
