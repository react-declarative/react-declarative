import dayjs from "dayjs";

export const getYears = (minDate, maxDate) => {
  const total = maxDate.diff(minDate, "years") + 1;
  const years = [];
  for (let i = 0; i !== total; i++) {
    years.push(minDate.clone().add(i, "years"));
  }
  return years;
};

export default getYears;
