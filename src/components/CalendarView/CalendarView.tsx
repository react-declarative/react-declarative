import * as React from "react";
import { useMemo, useState } from "react";
import dayjs from "dayjs";

import isToday from "dayjs/plugin/isToday";
import localeData from "dayjs/plugin/localeData";
import enLocale from "dayjs/locale/en-gb";
import utc from "dayjs/plugin/utc";

import { makeStyles } from "../../styles";

import PaperView from "../PaperView";

import { RequestProvider } from "./context/RequestContext";
import { PropsProvider } from "./context/PropsContext";

import MonthSelection from "./components/MonthSelection";
import YearSelection from "./components/YearSelection";
import Calendar from "./components/Calendar";

import useSingleton from "../../hooks/useSingleton";

import ICalendarViewProps from "./model/ICalendarViewProps";
import IAnything from "../../model/IAnything";

import getGenesisStamp from "../../utils/getGenesisStamp";
import classNames from "../../utils/classNames";

const MIN_DATE = getGenesisStamp() as unknown as string;
const MAX_DATE = new Date(4102434000000) as unknown as string;

const useStyles = makeStyles()((theme) => ({
  container: {
    width: "100%",
    minHeight: "100%",
    padding: theme.spacing(1),
  },
}));

/**
 * CalendarView component displays a calendar with various functionalities such as selecting dates, changing months, and changing years.
 *
 * @template Data - The type of data to be passed to the component
 * @template Payload - The type of payload to be used in the component
 *
 * @param props - The props object containing the necessary parameters for the CalendarView component
 *
 * @returns - The rendered CalendarView component
 */
export const CalendarView = <
  Data extends IAnything = IAnything,
  Payload extends IAnything = IAnything
>(
  props: ICalendarViewProps<Data, Payload>
) => {
  const { classes } = useStyles();

  const {
    className,
    style,
    sx,
    date: upperDate = dayjs(),
    minDate = dayjs(MIN_DATE),
    maxDate = dayjs(MAX_DATE),
    onChange = () => {},
    outlinePaper,
    transparentPaper,
  } = props;

  const payload = useSingleton(props.payload || ({} as Payload));

  const [date, setDate] = useState(() =>
    upperDate.isBefore(minDate) ? minDate : upperDate
  );

  const [showYearSelection, setShowYearSelection] = useState(false);
  const [showMonthSelection, setShowMonthSelection] = useState(false);

  const openYearSelection = () => setShowYearSelection(true);
  const openMonthSelection = () => setShowMonthSelection(true);

  const startOfDay = date.startOf("day");

  /**
   * Changes the year of the given date and updates the state.
   *
   * @param date - The date object whose year needs to be changed.
   * @returns
   */
  const onYearChange = (date: dayjs.Dayjs) => {
    setShowYearSelection(false);
    setDate(date.clone().set("year", date.get("year")));
  };

  /**
   * Updates the selected month and hides the month selection panel.
   *
   * @param date - The new selected date.
   * @returns
   */
  const onMonthChange = (date: dayjs.Dayjs) => {
    setShowMonthSelection(false);
    setDate(date.clone().set("month", date.get("month")));
  };

  const renderInner = () => {
    if (showYearSelection) {
      return (
        <YearSelection
          date={startOfDay}
          onChange={onYearChange}
          minDate={minDate}
          maxDate={maxDate}
        />
      );
    }

    if (showMonthSelection) {
      return (
        <MonthSelection
          date={startOfDay}
          onChange={onMonthChange}
          minDate={minDate}
          maxDate={maxDate}
        />
      );
    }

    return (
      <RequestProvider initialState={null}>
        <Calendar
          date={startOfDay}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          onHeaderMonthClick={openMonthSelection}
          onHeaderYearClick={openYearSelection}
        />
      </RequestProvider>
    );
  };

  const context = useMemo(
    () => ({
      ...props,
      payload,
    }),
    []
  );

  return (
    <PropsProvider payload={context}>
      <PaperView
        className={classNames(classes.container, className)}
        style={style}
        sx={sx}
        outlinePaper={outlinePaper}
        transparentPaper={transparentPaper}
      >
        {renderInner()}
      </PaperView>
    </PropsProvider>
  );
};

/**
 * Initializes the dayjs for CalendarView component.
 *
 * @memberof CalendarView
 */
CalendarView.init = () => {
  dayjs.extend(localeData);
  dayjs.extend(utc);
  dayjs.extend(isToday);
  dayjs.locale(enLocale);
};

export default CalendarView;
