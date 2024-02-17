import dayjs from "dayjs";

export const getDays = (minDate, maxDate) => {
  const total = maxDate.diff(minDate, "days") + 1;
  const days = [];
  for (let i = 0; i !== total; i++) {
    days.push(minDate.clone().add(i, "days"));
  }
  return days;
};

export default getDays;
