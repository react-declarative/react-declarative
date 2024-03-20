import dayjs from "dayjs";

/**
 * Retrieves an array of the next 12 months starting from the current month.
 *
 * @returns The array of the next 12 months.
 */
export const getMonths = () => {
  const months = [];
  const startDate = dayjs().startOf("year");
  for (let i = 0; i !== 12; i++) {
    months.push(startDate.clone().add(i, "months"));
  }
  return months;
};

export default getMonths;
