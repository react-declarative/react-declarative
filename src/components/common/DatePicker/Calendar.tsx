import * as React from 'react';
import { useState, useCallback } from 'react';
import { Fragment } from 'react';

import { makeStyles } from "../../../styles";

import IconButton from '@mui/material/IconButton';

import dayjs from 'dayjs';

import classNames from '../../../utils/classNames';

import CalendarHeader from './CalendarHeader';

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

const getDays = (minDate: dayjs.Dayjs, maxDate: dayjs.Dayjs) => {
  const total = maxDate.diff(minDate, 'days') + 1;
  const days: dayjs.Dayjs[] = [];
  for (let i = 0; i !== total; i++) {
    days.push(minDate.clone().add(i, 'days'));
  }
  return days;
};

const getWeeks = (minDate: dayjs.Dayjs, maxDate: dayjs.Dayjs) => {
  const total = maxDate.diff(minDate, 'weeks') + 1;
  const weeks: dayjs.Dayjs[] = [];
  for (let i = 0; i !== total; i++) {
    weeks.push(minDate.clone().add(i, 'weeks'));
  }
  return weeks;
};

export const Calendar = ({
  onChange = (change: any) => console.log({change}),
  disableFuture = false,
  date = dayjs(),
}) => {
  const { classes } = useStyles();
  const [currentMonth, setCurrentMonth] = useState(
    date.clone().startOf('month')
  );
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
  const onDateSelect = (day: any) => onChange(day);
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
