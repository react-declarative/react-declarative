import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from "../../../styles";

import Toolbar from '@mui/material/Toolbar';

import dayjs from 'dayjs';

import ToolbarButton from '../ToolbarButton';
import YearSelection from './YearSelection';
import Calendar from './Calendar';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: 300,
    height: 420,
  },
  toolbar: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 100,
  },
}))

/**
 * A customizable date picker component.
 *
 * @param props - The component props.
 * @param props.date - The initial date to display in the date picker.
 * @param props.minDate - The minimum selectable date in the date picker. Defaults to '1900-01-01'.
 * @param props.maxDate - The maximum selectable date in the date picker. Defaults to '2100-01-01'.
 * @param props.onChange - The callback function triggered when the selected date is changed.
 * @param props.disableFuture - Boolean indicating whether future dates should be disabled. Defaults to false.
 * @param props.animateYearScrolling - Boolean indicating whether to animate the year scrolling. Defaults to true.
 * @param props.openToYearSelection - Boolean indicating whether to open the date picker in year selection mode. Defaults to false.
 *
 * @returns The date picker component.
 */
export const DatePicker = ({
  date: upperDate = dayjs(),
  minDate = '1900-01-01',
  maxDate = '2100-01-01',
  onChange = (change: any) => console.log({ change }),
  disableFuture = false,
  animateYearScrolling = true,
  openToYearSelection = false,
}) => {
  const [date, setDate] = useState(upperDate);
  const [showYearSelection, setShowYearSelection] = useState(openToYearSelection);
  const { classes } = useStyles();
  /**
   * Sets the showYearSelection state to true, allowing the year selection to be displayed.
   *
   * @function openYearSelection
   */
  const openYearSelection = () => setShowYearSelection(true);
  /**
   * Sets the showYearSelection flag to false, hiding the year selection UI in the calendar.
   *
   * @function openCalendar
   * @returns
   */
  const openCalendar = () => setShowYearSelection(false);
  const startOfDay = date.startOf('day');
  /**
   * Updates the date and triggers the onChange event.
   *
   * @param date - The updated date value.
   */
  const handleChange = (date: any) => {
    setDate(date);
    onChange(date);
  };
  /**
   * Triggers a callback function when the year is changed.
   *
   * @param date - The new date value.
   */
  const onYearChange = (date: any) => {
    setShowYearSelection(false);
    handleChange(date);
  };
  return (
    <div className={classes.container}>
      <Toolbar className={classes.toolbar}>
        <ToolbarButton
          type="subheading"
          onClick={openYearSelection}
          selected={showYearSelection}
          label={date.format('YYYY')}
        />
        <ToolbarButton
          type="display1"
          onClick={openCalendar}
          selected={!showYearSelection}
          label={date.format('ddd, MMM DD')}
        />
      </Toolbar>
      {
        showYearSelection
          ?
          <YearSelection
            date={startOfDay}
            onChange={onYearChange}
            minDate={dayjs(minDate)}
            maxDate={dayjs(maxDate)}
            disableFuture={disableFuture}
            animateYearScrolling={animateYearScrolling}
          />
          :
          <Calendar
            date={startOfDay}
            onChange={handleChange}
            disableFuture={disableFuture}
          />
      }
    </div>
  );
}

export default DatePicker;
