import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import dayjs from 'dayjs';

import IconButton from '@material-ui/core/IconButton';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import classNames from '../../../utils/classNames';

const getWeekdaysMin = () => {
  const { weekdaysMin, weekStart } = dayjs.Ls[dayjs.locale()];
  return [...weekdaysMin!.slice(weekStart), ...weekdaysMin!.slice(0, weekStart)];
};

const useStyles = makeStyles((theme) => ({
  switchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px 0 20px',
  },
  daysHeader: {
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'stretch',
  },
  dayLabel: {
    flex: 1,
    margin: '0 12px 0 12px',
    fontSize: 13,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  dayLabelStart: {
    textAlign: 'start',
  },
  dayLabelEnd: {
    textAlign: 'end',
  },
  monthName: {
    color: theme.palette.text.primary,
  },
}));

export const CalendarHeader = ({
  currentMonth = dayjs(),
  onMonthChange = (month: any) => console.log({month}),
}) => {
  const classes = useStyles();
  const selectNextMonth = () => onMonthChange(currentMonth.clone().add(1, 'months'));
  const selectPreviousMonth = () => onMonthChange(currentMonth.clone().subtract(1, 'months'));
  return (
    <div>
      <div className={classes.switchHeader}>
        <IconButton onClick={selectPreviousMonth}>
          <KeyboardArrowLeft/>
        </IconButton>
        <div className={classes.monthName}>
          { currentMonth.format('MMMM YYYY')}
        </div>
        <IconButton onClick={selectNextMonth}>
          <KeyboardArrowRight/>
        </IconButton>
      </div>
      <div className={classes.daysHeader}>
        { getWeekdaysMin().map((day, index) => (
          <div key={day} className={classNames(classes.dayLabel, {
            [classes.dayLabelStart]: index === 0,
            [classes.dayLabelEnd]: index === 6,
          })}> { day } </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
