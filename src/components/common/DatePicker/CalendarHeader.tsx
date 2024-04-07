import * as React from 'react';

import { makeStyles } from "../../../styles";

import dayjs from 'dayjs';

import IconButton from '@mui/material/IconButton';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import classNames from '../../../utils/classNames';

/**
 * Get an array of abbreviated weekday names.
 *
 * @returns An array of abbreviated weekday names.
 */
const getWeekdaysMin = () => {
  const { weekdays, weekdaysMin, weekStart = 0 } = dayjs.Ls[dayjs.locale()];
  const days = weekdaysMin! || weekdays;
  const result = [...days.slice(weekStart, 7), ...days.slice(0,weekStart)];
  return result.map((d) => d.slice(0, 1).toUpperCase());
};

/**
 * Defines the styles for a component.
 * @typedef {Object} Styles
 * @property switchHeader - The style for the switch header container.
 * @property daysHeader - The style for the days header container.
 * @property dayLabel - The style for the day label.
 * @property dayLabelStart - The style for the day label at the start.
 * @property dayLabelEnd - The style for the day label at the end.
 * @property monthName - The style for the month name.
 */
const useStyles = makeStyles()((theme) => ({
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

/**
 * Creates a calendar header component.
 * @param options - The options object.
 * @param options.currentMonth - The current month. Should be a dayjs object. Defaults to the current month.
 * @param options.onMonthChange - The callback function to handle month changes. Defaults to logging the selected month.
 * @returns The calendar header component JSX element.
 */
export const CalendarHeader = ({
  currentMonth = dayjs(),
  onMonthChange = (month: any) => console.log({month}),
}) => {
  const { classes } = useStyles();
  /**
   * Function to select the next month.
   * Updates the current month by adding 1 month.
   *
   * @function selectNextMonth
   * @returns
   */
  const selectNextMonth = () => onMonthChange(currentMonth.clone().add(1, 'months'));
  /**
   * Selects the previous month.
   *
   * This function is used to navigate to the previous month by subtracting
   * 1 month from the current month and triggering a month change event.
   *
   * @param onMonthChange - A function to handle the month change event.
   * @param currentMonth - The current month.
   * @returns
   */
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
          <div key={index} className={classNames(classes.dayLabel, {
            [classes.dayLabelStart]: index === 0,
            [classes.dayLabelEnd]: index === 6,
          })}> { day } </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
