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

const CALENDAR_WRAPPER = 'react-declarative__calendarWrapper';

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
    overflow: "hidden",
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

/**
 * Represents the properties for the Calendar component.
 */
interface ICalendarProps {
  onChange: (date: dayjs.Dayjs | null) => void;
  onHeaderMonthClick: () => void;
  onHeaderYearClick: () => void;
  minDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  date: dayjs.Dayjs;
}

/**
 * Represents a calendar component.
 *
 * @typedef ICalendarProps
 * @property onChange - Callback function triggered when a date is selected.
 * @property onHeaderMonthClick - Callback function triggered when the header month is clicked.
 * @property onHeaderYearClick- Callback function triggered when the header year is clicked.
 * @property minDate - The minimum selectable date.
 * @property maxDate - The maximum selectable date.
 * @property date - The currently selected date.
 */
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

  /**
   * Renders the days of a given week.
   *
   * @param week - The week to render the days for.
   * @return {Array<JSX.Element>} - The rendered days as an array of JSX elements.
   */
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

  /**
   * Renders the weeks within the current month.
   *
   * @returns The rendered weeks.
   *
   * @remarks
   * This function uses the currentMonth and renderDays variables to determine
   * the start and end dates of the weeks to render. It then calls the getWeeks
   * function to get a list of weeks between the start and end dates. Finally,
   * for each week in the list, it calls the renderDays function to render the
   * individual days of the week.
   *
   */
  const renderWeeks = useCallback(() => {
    const start = currentMonth.clone().startOf("week");
    const end = currentMonth.clone().endOf("month").endOf("week");
    return getWeeks(start, end).map((week) => (
      <React.Fragment key={`week-${week.toString()}`}>
        {renderDays(week)}
      </React.Fragment>
    ));
  }, [currentMonth, renderDays]);

  /**
   * Changes the current month to the specified new month.
   *
   * @param newMonth - The new month to set as the current month.
   */
  const handleChangeMonth = (newMonth: dayjs.Dayjs) =>
    setCurrentMonth(newMonth);

  const { classes, cx } = useStyles();

  return (
    <div className={classes.container}>
      <CalendarHeader
        currentMonth={currentMonth}
        onMonthChange={handleChangeMonth}
        onHeaderMonthClick={onHeaderMonthClick}
        onHeaderYearClick={onHeaderYearClick}
      />
      <div className={cx(classes.calendar, CALENDAR_WRAPPER)}>{renderWeeks()}</div>
    </div>
  );
};

export default Calendar;
