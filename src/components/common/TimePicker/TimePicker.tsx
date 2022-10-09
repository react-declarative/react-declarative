import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { Theme } from '@mui/material';
import { makeStyles } from '../../../styles';

import Toolbar from '@mui/material/Toolbar';

import dayjs from 'dayjs';

import ToolbarButton from '../ToolbarButton';

import HourView from './HourView';
import MinutesView from './MinutesView';

const globalStyles = (theme: Theme) => ({
  container: {
    width: 300,
    height: 420,
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    height: 100,
  },
});

const useStyles = makeStyles()((theme) => ({
  ...globalStyles(theme),
  toolbar: {
    ...globalStyles(theme).toolbar,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 50,
  },
  separator: {
    margin: '0 2px 0 4px',
    cursor: 'default',
  },
  ampmSelection: {
    marginLeft: 20,
    marginRight: -20,
  },
  ampmLabel: {
    fontSize: 18,
  },
}));

export const TimePicker = ({
  onChange = (change: any) => console.log({change}),
  date = dayjs(),
}) => {
  const { classes } = useStyles();
  const [state, setState] = useState({
    meridiemMode: date.format('a'),
    isHourViewShown: true,
  });
  const handleChange = useCallback((time: dayjs.Dayjs) => {
    if (time.format('a') !== state.meridiemMode) {
      const hours = state.meridiemMode === 'am'
        ? time.hour() - 12
        : time.hour() + 12;
      time = time.clone().hour(hours);
    }
    onChange(time);
  }, [state]);
  const setMeridiemMode = (mode: any) => () => setState((p) => ({...p, meridiemMode: mode }));
  useEffect(() => handleChange(date), [date, state.meridiemMode]);
  const openMinutesView = () => setState((p) => ({...p, isHourViewShown: false}));
  const openHourView = () => setState((p) => ({...p, isHourViewShown: true}));
  return (
    <div className={classes.container}>
      <Toolbar className={classes.toolbar}>
        <ToolbarButton
          type="display3"
          onClick={openHourView}
          selected={state.isHourViewShown}
          label={date.format('hh')}
        />
        <ToolbarButton
          type="display3"
          label=":"
          selected={false}
          className={classes.separator}
        />
        <ToolbarButton
          type="display3"
          onClick={openMinutesView}
          selected={!state.isHourViewShown}
          label={date.format('mm')}
        />
        <div className={classes.ampmSelection}>
          <ToolbarButton
            className={classes.ampmLabel}
            selected={state.meridiemMode === 'am'}
            type="subheading"
            label="AM"
            onClick={setMeridiemMode('am')}
          />
          <ToolbarButton
            className={classes.ampmLabel}
            selected={state.meridiemMode === 'pm'}
            type="subheading"
            label="PM"
            onClick={setMeridiemMode('pm')}
          />
        </div>
      </Toolbar>
      {
        state.isHourViewShown
          ?
            <HourView
              date={date}
              onChange={handleChange}
            />
          :
            <MinutesView
              date={date}
              onChange={handleChange}
            />
      }
    </div>
  );
};

export default TimePicker;
