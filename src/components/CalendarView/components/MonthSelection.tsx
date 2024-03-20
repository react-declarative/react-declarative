import * as React from 'react';
import { useCallback, useState } from "react";
import dayjs from "dayjs";

import { makeStyles } from '../../../styles';

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import getMonthLabels from '../utils/getMonthLabels';
import getMonths from '../utils/getMonths';

import classNames from "../../../utils/classNames";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const useStyles = makeStyles()((theme) => ({
  container: {
    height: '100%',
    width: '100%',
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
  },
  stretch: { flex: 1 },
  disabled: { pointerEvents: "none", opacity: 0.5 },
  monthLabel: { textAlign: "center" },
  noBorder: { border: "0" },
  arrows: {
    padding: "5px",
    color: theme.palette.text.secondary,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5px",
  },
  content: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridGap: "15px",
    button: { color: theme.palette.text.primary },
  },
}));

/**
 * Represents the properties for a MonthSelection component.
 *
 * @interface IMonthSelectionProps
 */
interface IMonthSelectionProps {
  date: dayjs.Dayjs;
  minDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  onChange: (change: dayjs.Dayjs) => void;
}

/**
 * Represents a Month Selection component.
 *
 * @param props - The component properties.
 * @param props.date - The selected date.
 * @param props.minDate - The minimum selectable date.
 * @param props.maxDate - The maximum selectable date.
 * @param props.onChange - The callback function to handle date selection change.
 *
 * @returns - The Month Selection component.
 */
export const MonthSelection = ({
  date,
  minDate,
  maxDate,
  onChange,
}: IMonthSelectionProps) => {
  const [currentYear, setCurrentYear] = useState(date.get("year"));

  const monthList = getMonths().map((month) => month.get("month"));
  const monthLabels = getMonthLabels();

  const { classes } = useStyles();

  const onMonthSelect = useCallback(
    (month: number) => {
      let pendingDate = date.clone().set("month", month);
      pendingDate = pendingDate.set("year", currentYear);
      if (date && maxDate.isBefore(date)) {
        onChange(maxDate.clone());
        return;
      }
      if (date && minDate.isAfter(date)) {
        onChange(minDate.clone());
        return;
      }
      onChange(pendingDate);
    },
    [currentYear, date, maxDate, minDate, onChange]
  );

  const handleNextYear = () => {
    const pendingYear = currentYear + 1;
    if (pendingYear <= maxDate.get("year")) {
      setCurrentYear(pendingYear);
    }
  };

  const handlePrevYear = () => {
    const pendingYear = currentYear - 1;
    if (pendingYear >= minDate.get("year")) {
      setCurrentYear(pendingYear);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <IconButton className={classes.noBorder} onClick={handlePrevYear}>
          <ArrowBackIosIcon className={classes.arrows} />
        </IconButton>
        <Typography className={classNames(classes.monthLabel, classes.stretch)}>
          {currentYear}
        </Typography>
        <IconButton className={classes.noBorder} onClick={handleNextYear}>
          <ArrowForwardIosIcon className={classes.arrows} />
        </IconButton>
      </div>
      <div className={classes.content}>
        {monthList.map((monthNumber: number) => {
          const isDisabled =
            (maxDate.get("month") < monthNumber &&
              maxDate.get("year") === currentYear) ||
            (minDate.get("month") > monthNumber &&
              minDate.get("year") === currentYear);
          return (
            <Button
              key={monthNumber}
              className={classNames({
                [classes.disabled]: isDisabled,
              })}
              onClick={() => onMonthSelect(monthNumber)}
            >
              {monthLabels[monthNumber]}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthSelection;
