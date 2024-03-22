import * as React from "react";
import { useMemo } from "react";
import dayjs from "dayjs";

import { makeStyles } from "../../../styles";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import usePropsContext from "../context/PropsContext";

import classNames from "../../../utils/classNames";
import getWeekLabels from "../utils/getWeekLabels";
import getMomentStamp from "../../../utils/getMomentStamp";

import ArrowBackIosIcon from "@mui/icons-material/KeyboardArrowLeft";
import ArrowForwardIosIcon from "@mui/icons-material/KeyboardArrowRight";

const useStyles = makeStyles()((theme) => ({
  switchHeader: {
    display: "flex",
    justifyContent: "space-between",
    overflowY: "auto",
    alignItems: "center",
    margin: "5px 0 10px",
  },
  daysHeader: {
    display: "flex",
    justifyContent: "stretch",
    alignItems: "stretch",
    height: "35px",
  },
  monthName: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "14px",
    button: { padding: "5px", color: theme.palette.text.primary },
  },
  dayLabel: { flex: 1, textAlign: "center", opacity: 0.5 },
  dayLabelStart: { textAlign: "center" },
  dayLabelEnd: { textAlign: "center" },
  noBorder: { border: "0" },
}));

/**
 * Represents the properties for the CalendarHeader component.
 *
 * @interface ICalendarHeaderProps
 */
interface ICalendarHeaderProps {
  currentMonth: dayjs.Dayjs;
  onMonthChange: (month: dayjs.Dayjs) => void;
  onHeaderMonthClick: () => void;
  onHeaderYearClick: () => void;
}

/**
 * CalendarHeader component.
 *
 * @param currentMonth - The current month.
 * @param onMonthChange - The callback function when the month changes.
 * @param onHeaderMonthClick - The callback function when the month in the header is clicked.
 * @param onHeaderYearClick - The callback function when the year in the header is clicked.
 * @returns The rendered CalendarHeader component.
 */
export const CalendarHeader = ({
  currentMonth,
  onMonthChange,
  onHeaderMonthClick,
  onHeaderYearClick,
}: ICalendarHeaderProps) => {

  const { AfterCalendarHeader, BeforeCalendarHeader, payload } =
    usePropsContext();

  const selectNextMonth = () =>
    onMonthChange(currentMonth.clone().add(1, "months"));
  const selectPreviousMonth = () =>
    onMonthChange(currentMonth.clone().subtract(1, "months"));

  const { classes } = useStyles();

  /**
   * The starting timestamp for the given month.
   *
   * @type {number}
   */
  const fromStamp = useMemo(
    () => getMomentStamp(currentMonth.clone().startOf("week")),
    []
  );

  /**
   * Represents a memoized timestamp value.
   *
   * @type {any}
   */
  const toStamp = useMemo(
    () => getMomentStamp(currentMonth.clone().endOf("month").endOf("week")),
    []
  );

  return (
    <div>
      <div className={classes.switchHeader}>
        <IconButton onClick={selectPreviousMonth}>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography className={classes.monthName}>
          {BeforeCalendarHeader && (
            <BeforeCalendarHeader
              fromStamp={fromStamp}
              toStamp={toStamp}
              payload={payload}
            />
          )}
          <Button
            onClick={onHeaderMonthClick}
            className={classNames(classes.noBorder)}
          >
            {currentMonth.format("MMMM")}
          </Button>
          <Button
            onClick={onHeaderYearClick}
            className={classNames(classes.noBorder)}
          >
            {currentMonth.format("YYYY")}
          </Button>
          {AfterCalendarHeader && (
            <AfterCalendarHeader
              fromStamp={fromStamp}
              toStamp={toStamp}
              payload={payload}
            />
          )}
        </Typography>
        <IconButton className={classes.noBorder} onClick={selectNextMonth}>
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
      <div className={classes.daysHeader}>
        {getWeekLabels().map((day, index) => (
          <Typography
            key={index}
            className={classNames(classes.dayLabel, {
              [classes.dayLabelStart]: index === 0,
              [classes.dayLabelEnd]: index === 6,
            })}
          >
            {day}
          </Typography>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
