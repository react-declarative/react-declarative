import dayjs from "dayjs";

export const getWeeks = (minDate, maxDate) => {
  const total = maxDate.diff(minDate, "weeks") + 1;
  const weeks = [];
  for (let i = 0; i !== total; i++) {
    weeks.push(minDate.clone().add(i, "weeks"));
  }
  return weeks;
};

export default getWeeks;
