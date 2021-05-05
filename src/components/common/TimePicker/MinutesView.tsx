import * as React from 'react';

import dayjs from 'dayjs';

import { MINUTES } from './time';

import Clock from './Clock';
import ClockNumber from './ClockNumber';

export const MinutesView = ({
  onChange = (change: any) => console.log({change}),
  date = dayjs(),
}) => {
  const value = date.get('minutes');
  const handleChange = (minutes: any) => {
    const updatedDate = date.clone().minute(minutes);
    onChange(updatedDate);
  };
  return (
    <Clock
      type={MINUTES}
      onChange={handleChange}
      value={value}
    >
      <ClockNumber onClick={() => handleChange(0)} label="00" selected={value === 0} index={0} />
      <ClockNumber onClick={() => handleChange(5)} label="05" selected={value === 5} index={1} />
      <ClockNumber onClick={() => handleChange(10)} label="10" selected={value === 10} index={2} />
      <ClockNumber onClick={() => handleChange(15)} label="15" selected={value === 15} index={3} />
      <ClockNumber onClick={() => handleChange(20)} label="20" selected={value === 20} index={4} />
      <ClockNumber onClick={() => handleChange(25)} label="25" selected={value === 25} index={5} />
      <ClockNumber onClick={() => handleChange(30)} label="30" selected={value === 30} index={6} />
      <ClockNumber onClick={() => handleChange(35)} label="35" selected={value === 35} index={7} />
      <ClockNumber onClick={() => handleChange(40)} label="40" selected={value === 40} index={8} />
      <ClockNumber onClick={() => handleChange(45)} label="45" selected={value === 45} index={9} />
      <ClockNumber onClick={() => handleChange(50)} label="50" selected={value === 50} index={10} />
      <ClockNumber onClick={() => handleChange(55)} label="55" selected={value === 55} index={11} />
    </Clock>
  );
};

export default MinutesView;
