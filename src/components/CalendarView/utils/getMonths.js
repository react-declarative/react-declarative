import dayjs from "dayjs";

export const getMonths = () => {
  const months = [];
  const startDate = dayjs().startOf("year");
  for (let i = 0; i !== 12; i++) {
    months.push(startDate.clone().add(i, "months"));
  }
  return months;
};

export default getMonths;
