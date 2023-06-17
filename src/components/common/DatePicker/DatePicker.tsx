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
  const openYearSelection = () => setShowYearSelection(true);
  const openCalendar = () => setShowYearSelection(false);
  const startOfDay = date.startOf('day');
  const handleChange = (date: any) => {
    setDate(date);
    onChange(date);
  };
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
