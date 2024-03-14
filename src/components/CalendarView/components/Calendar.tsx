import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

import { makeStyles } from "../../../styles";

import CalendarHeader from "./CalendarHeader";
import Day from "./Day";

import getMomentStamp from "../../../utils/getMomentStamp";
import classNames from "../../../utils/classNames";

import getWeeks from "../utils/getWeeks";
import getDays from "../utils/getDays";

import useReloadTrigger from "../../../hooks/useReloadTrigger";
import useRequestContext from "../context/RequestContext";
import usePropsContext from "../context/PropsContext";
import useSubject from "../../../hooks/useSubject";

const useStyles = makeStyles()((theme) => ({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  calendar: {
    flex: 1,
    display: "grid",
    background: theme.palette.background.paper,
    gridTemplateColumns: "repeat(7, 2fr)",
    gridRowGap: "2px",
  },
  inactiveDay: { opacity: 0.5, pointerEvents: "none" },
  day: { "& button": { border: "0", color: theme.palette.text.primary, height: '100%' } },
  cell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:nth-of-type(7n)": { justifyContent: '"flex-end"' },
    "&:nth-of-type(7n + 1)": { justifyContent: '"flex-start"' },
    margin: theme.spacing(0.5),
    border: `1px solid ${theme.palette.action.active}`,
  },
}));

interface ICalendarProps {
  onChange: (date: dayjs.Dayjs | null) => void;
  onHeaderMonthClick: () => void;
  onHeaderYearClick: () => void;
  minDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  date: dayjs.Dayjs;
}

export const Calendar = ({
  onChange,
  onHeaderMonthClick,
  onHeaderYearClick,
  minDate,
  maxDate,
  date,
}: ICalendarProps) => {

  const { reloadTrigger, doReload } = useReloadTrigger();

  const { handler, payload, reloadSubject: upperReloadSubject } = usePropsContext();

  const reloadSubject = useSubject(upperReloadSubject);

  const [currentMonth, setCurrentMonth] = useState(
    date.clone().startOf("month")
  );

  const [, setRequest] = useRequestContext();

  useEffect(() => {
    const start = getMomentStamp(currentMonth.clone().startOf("week"));
    const end = getMomentStamp(
      currentMonth.clone().endOf("month").endOf("week")
    );
    const fetch = async () => {
      const result = await handler({
        fromStamp: start,
        toStamp: end,
        payload,
      });
      return result.map((item) => ({ ...item, payload }));
    };
    setRequest({
      fromStamp: start,
      toStamp: end,
      payload,
      promise: fetch(),
    });
  }, [currentMonth, reloadTrigger]);

  useEffect(() => reloadSubject.subscribe(doReload), []);

  const renderDays = useCallback(
    (week: dayjs.Dayjs) => {
      const end = week.clone().endOf("week");
      const currentMonthNumber = currentMonth.get("month");
      return getDays(week, end).map((day: dayjs.Dayjs) => {
        const isActive = date.isSame(day, "date");
        const isDisabled =
          day.get("month") !== currentMonthNumber ||
          maxDate.isBefore(day) ||
          minDate.isAfter(day);
        return (
          <div
            key={day.toString()}
            className={classNames(classes.day, classes.cell, {
              [classes.inactiveDay]: isDisabled,
            })}
          >
            <Day day={day} isActive={isActive} onChange={onChange} />
          </div>
        );
      });
    },
    [currentMonth, date, maxDate, minDate, onChange]
  );

  const renderWeeks = useCallback(() => {
    const start = currentMonth.clone().startOf("week");
    const end = currentMonth.clone().endOf("month").endOf("week");
    return getWeeks(start, end).map((week) => (
      <React.Fragment key={`week-${week.toString()}`}>
        {renderDays(week)}
      </React.Fragment>
    ));
  }, [currentMonth, renderDays]);

  const handleChangeMonth = (newMonth: dayjs.Dayjs) =>
    setCurrentMonth(newMonth);

  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <CalendarHeader
        currentMonth={currentMonth}
        onMonthChange={handleChangeMonth}
        onHeaderMonthClick={onHeaderMonthClick}
        onHeaderYearClick={onHeaderYearClick}
      />
      <div className={classes.calendar}>{renderWeeks()}</div>
    </div>
  );
};

export default Calendar;
