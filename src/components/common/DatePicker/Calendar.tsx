import * as React from 'react';
import { useState, useCallback } from 'react';
import { Fragment } from 'react';

import { makeStyles } from "../../../styles";

import IconButton from '@mui/material/IconButton';

import dayjs from 'dayjs';

import classNames from '../../../utils/classNames';

import CalendarHeader from './CalendarHeader';

/**
 * This variable `useStyles` is a function that returns an object with CSS classes.
 * This object defines styles for the calendar component.
 *
 * @returns {Object} An object containing CSS classes for the calendar component.
 */
const useStyles = makeStyles()((theme) => ({
  calendar: {
    marginTop: 10,
    display: 'grid',
    gridTemplateColumns: '1fr repeat(5, 2fr) 1fr',
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  day: {
    width: 36,
    height: 36,
    fontSize: 14,
    margin: '0 2px',
    color: theme.palette.text.primary,
  },
  selected: {
    color: theme.palette.primary[700],
    backgroundColor: theme.palette.primary[200],
  },
  disabled: {
    pointerEvents: 'none',
    color: theme.palette.text.disabled,
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& :nth-of-type(7n)': {
      justifyContent: 'flex-end',
    },
    '& :nth-of-type(7n + 1)': {
      justifyContent: 'flex-start',
    },
  },
  container: {},
}));

/**
 * Calculates all the days between the given minimum and maximum date.
 *
 * @param minDate - The minimum date.
 * @param maxDate - The maximum date.
 * @returns An array of all the days between the minimum and maximum date.
 */
const getDays = (minDate: dayjs.Dayjs, maxDate: dayjs.Dayjs) => {
  const total = maxDate.diff(minDate, 'days') + 1;
  const days: dayjs.Dayjs[] = [];
  for (let i = 0; i !== total; i++) {
    days.push(minDate.clone().add(i, 'days'));
  }
  return days;
};

/**
 * Calculates the array of weeks between two given dates.
 *
 * @param minDate - The minimum date.
 * @param maxDate - The maximum date.
 * @returns The array of weeks between minDate and maxDate.
 */
const getWeeks = (minDate: dayjs.Dayjs, maxDate: dayjs.Dayjs) => {
  const total = maxDate.diff(minDate, 'weeks') + 1;
  const weeks: dayjs.Dayjs[] = [];
  for (let i = 0; i !== total; i++) {
    weeks.push(minDate.clone().add(i, 'weeks'));
  }
  return weeks;
};

/**
 * Creates a Calendar component.
 *
 * @param onChange - Callback function that will be invoked when the date selection changes.
 * @param disableFuture - Determines whether future dates should be disabled.
 * @param date - The initial date for the calendar, in dayjs format.
 * @returns - A calendar component.
 */
export const Calendar = ({
  onChange = (change: any) => console.log({change}),
  disableFuture = false,
  date = dayjs(),
}) => {
  const { classes } = useStyles();
  const [currentMonth, setCurrentMonth] = useState(
    date.clone().startOf('month')
  );
  /**
   * Renders the days of a given week.
   *
   * @param {dayjs.Dayjs} week - The week to render the days for.
   *
   * @returns {React.ReactNode} - The rendered days as React nodes.
   */
  const renderDays = useCallback((week: dayjs.Dayjs) => {
    const end = week.clone().endOf('week');
    const currentMonthNumber = currentMonth.get('month');
    return getDays(week, end)
      .map((day: dayjs.Dayjs) => {
        const dayClass = classNames(classes.day, classes.cell, {
          [classes.hidden]: day.get('month') !== currentMonthNumber,
          [classes.selected]: day.toString() === date.toString(),
          [classes.disabled]: disableFuture && day.isAfter(dayjs()),
          [classes.active]: date.isSame(day, 'date')
        });
        return (
          <IconButton
            key={day.toString()}
            className={dayClass}
            onClick={() => onDateSelect(day)}
          >
            <span> { day.format('DD')} </span>
          </IconButton>
        );
      });
  }, [disableFuture, classes, date, currentMonth]);
  /**
   * Renders the weeks of the current month.
   *
   * @returns {Component[]} - An array of React components representing the weeks.
   * @category Rendering
   */
  const renderWeeks = useCallback(() => {
    const start = currentMonth.clone().startOf('week');
    const end = currentMonth.clone().endOf('month').endOf('week');
    return getWeeks(start, end)
      .map(week => (
        <Fragment key={`week-${week.toString()}`}>
          { renderDays(week) }
        </Fragment>
      ));
  }, [currentMonth]);
  /**
   * Represents a function that is triggered when a date is selected.
   *
   * @callback OnDateSelect
   * @param day - The selected date.
   * @returns
   */
  const onDateSelect = (day: any) => onChange(day);
  /**
   * Updates the current month based on the provided input.
   *
   * @param newMonth - The new month value.
   * @returns
   */
  const handleChangeMonth = (newMonth: any) => setCurrentMonth(newMonth);
  return (
    <div className={classes.container}>
      <CalendarHeader
        currentMonth={currentMonth}
        onMonthChange={handleChangeMonth}
      />
      <div className={classes.calendar}>
        { renderWeeks() }
      </div>
    </div>
  );
};

export default Calendar;
