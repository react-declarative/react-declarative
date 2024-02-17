import * as React from 'react';
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";

import { makeStyles } from '../../../styles';

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import classNames from '../../../utils/classNames';
import getYears from '../utils/getYears';

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const YEARS_IN_GROUP = 12;

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
  yearLabel: { textAlign: "center" },
  noBorder: { border: "0" },
  arrows: {
    padding: "5px",
    border: "0",
    color: theme.palette.text.disabled,
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

interface IYearSelectionProps {
  date: dayjs.Dayjs;
  minDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  onChange: (change: dayjs.Dayjs) => void;
}

export const YearSelection = ({
  date,
  minDate,
  maxDate,
  onChange,
}: IYearSelectionProps) => {
  const currentYear = date.get("year");

  const yearGroups = useMemo(() => {
    return getYears(minDate, maxDate)
      .map((year) => year.get("year"))
      .reduce<number[][]>(
        (acm, cur) => {
          const [lastBlock] = acm.slice().reverse();
          lastBlock.push(cur);
          if (lastBlock.length === YEARS_IN_GROUP) {
            return [...acm, []];
          } else {
            return acm;
          }
        },
        [[]]
      );
  }, [minDate, maxDate]);

  const [selectedPage, setSelectedPage] = useState(
    yearGroups.findIndex((line) => line.includes(currentYear))
  );

  const onYearSelect = useCallback(
    (year: number) => {
      const newDate = date.clone().set("year", year);
      if (date && maxDate.isBefore(date)) {
        onChange(maxDate.clone());
        return;
      }
      if (date && minDate.isAfter(date)) {
        onChange(minDate.clone());
        return;
      }
      onChange(newDate);
    },
    [date, maxDate, minDate, onChange]
  );

  const handleNextPage = () => {
    const nextPage = selectedPage + 1;
    if (nextPage < yearGroups.length) {
      setSelectedPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    setSelectedPage(Math.max(selectedPage - 1, 0));
  };

  const currentGroup = yearGroups[selectedPage] || [];

  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Button
          className={classes.noBorder}
          variant="text"
          onClick={handlePrevPage}
        >
          <ArrowBackIosIcon className={classes.arrows}/>
        </Button>
        <Typography className={classNames(classes.yearLabel, classes.stretch)}>
          {date.format('YYYY')}
        </Typography>
        <Button
          className={classes.noBorder}
          variant="text"
          onClick={handleNextPage}
        >
          <ArrowForwardIosIcon className={classes.arrows} />
        </Button>
      </div>
      <div className={classes.content}>
        {currentGroup.map((yearNumber: number) => {
          const isSelectedYear = yearNumber === currentYear;
          return (
            <Button
              key={yearNumber}
              color={isSelectedYear ? "primary" : "secondary"}
              onClick={() => onYearSelect(yearNumber)}
            >
              {yearNumber}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default YearSelection;
