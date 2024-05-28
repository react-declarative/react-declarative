import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { createElement } from "react";
import dayjs from "dayjs";

import { makeStyles } from "../../../styles";
import { alpha } from "@mui/material";

import Center from "../../Center";
import Tile from "../../Tile";
import Dot from "../../Dot";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import useRequestContext from "../context/RequestContext";
import usePropsContext from "../context/PropsContext";

import useAsyncAction from "../../../hooks/useAsyncAction";

import getMomentStamp from "../../../utils/getMomentStamp";
import { addUtcOffset } from "../../../utils/addUtcOffset";
import classNames from "../../../utils/classNames";
import isToday from "../utils/isToday";

import ICalendarItem from "../model/ICalendarItem";

const DOT_SIDE = 7.5;

const useStyles = makeStyles()((theme) => ({
  buttonAccient: {
    background: alpha(
      theme.palette.getContrastText(theme.palette.background.paper),
      0.018
    ),
  },
  button: {
    minWidth: "unset !important",
    height: '100%',
    width: "100%",
    '&:hover': {
      background: alpha(
        theme.palette.getContrastText(theme.palette.background.paper),
        0.018
      ),
    }
  },
  stretch: {
    flex: 1,
  },
}));

/**
 * Interface for props of a day component.
 */
interface IDayProps {
  onChange: (date: dayjs.Dayjs) => void;
  isActive: boolean;
  day: dayjs.Dayjs;
}

/**
 * Renders a Day component.
 *
 * @param props - The component props.
 * @param props.onChange - The function called when the day is changed.
 * @param props.day - The current day.
 *
 * @returns The rendered Day component.
 */
export const Day = ({ onChange, day }: IDayProps) => {
  const { classes } = useStyles();

  const { BeforeDayHeader, AfterDayHeader, onItemClick, tileMode } = usePropsContext();

  const [request] = useRequestContext();
  const {
    renderItem,
    payload,
    onLoadStart,
    onLoadEnd,
    fallback,
    rowMark,
    rowColor,
    dotSide = DOT_SIDE,
  } = usePropsContext();

  const [items, setItems] = useState<ICalendarItem[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const total = items.length;

  /**
   * Retrieves the current timestamp using a memoized version of the getMomentStamp function.
   * The getMomentStamp function is only executed once during the initial render, and its result is stored and reused for subsequent renders.
   *
   * @function currentStamp
   *
   * @returns The current timestamp.
   */
  const currentStamp = useMemo(() => { 
    return getMomentStamp(addUtcOffset(day));
  }, []);

  /**
   * Executes a given code block or function.
   *
   * @param code - The code block or function to be executed.
   * @param [context] - The optional context in which the code should be executed.
   * @param [args] - The optional arguments to be passed to the code block or function.
   * @returns - The result of executing the code. If the code block or function throws an error,
   *                the error will be caught and logged, and undefined will be returned.
   *
   */
    const { execute } = useAsyncAction(
    async () => {
      setItems([]);
      if (!request) {
        return;
      }

      const totalItems = await request.promise;
      const currentItems = totalItems.filter(
        ({ stamp }) => stamp === currentStamp
      );
      setItems(currentItems);
    },
    {
      onLoadStart,
      onLoadEnd,
      fallback,
    }
  );

  useEffect(() => {
    execute();
  }, [request]);

  /**
   * Returns the color for a dot based on certain conditions.
   * @returns - The color for the dot. Possible values are "red", "orange", or "green".
   */
  const getDotColor = () => {
    if (day.isBefore(dayjs().add(-1, "days"))) {
      return "red";
    }
    if (total > 3) {
      return "orange";
    }
    return "green";
  };

  /**
   * Render the inner content based on the value of the "items" array.
   * If the "items" array is empty, it renders a message indicating that no tasks are assigned for the day.
   * Otherwise, it renders a list of tasks for the day.
   *
   * @returns The rendered inner content.
   */
  const renderInner = () => {
    if (items.length === 0) {
      return (
        <Typography sx={{ p: 2 }}>На этот день задач не назначено</Typography>
      );
    }
    return (
      <Box sx={{ height: "356px", maxHeight: "45vh", width: "356px" }}>
        <List
          disablePadding
          subheader={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "stretch",
                mr: 1,
              }}
            >
              {BeforeDayHeader && (
                <BeforeDayHeader
                  items={items}
                  payload={payload}
                  stamp={currentStamp}
                />
              )}
              <ListSubheader component={Typography} sx={{ fontWeight: "bold" }}>
                {day.format("DD/MM/YYYY")}
              </ListSubheader>
              <div className={classes.stretch} />
              {AfterDayHeader && (
                <AfterDayHeader
                  items={items}
                  payload={payload}
                  stamp={currentStamp}
                />
              )}
            </Box>
          }
        >
          <Tile
            mode={tileMode}
            sx={{
              height: "calc(356px - 48px)",
              width: "356px",
              maxHeight: "calc(45vh - 48px)",
            }}
            data={items}
            rowMark={rowMark}
            rowColor={rowColor}
            payload={payload}
            onItemClick={({ data }) => {
              onItemClick && onItemClick(data);
              setAnchorEl(null);
            }}
          >
            {({ data, rowMark, index }) =>
              createElement(renderItem, {
                ...data,
                rowMark,
                index,
                onDaySelect: () => onChange(day),
              })
            }
          </Tile>
        </List>
      </Box>
    );
  };

  return (
    <>
      <Button
        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
        className={classNames(classes.button, {
          [classes.buttonAccient]: isToday(day),
        })}
      >
        <Center
          sx={{
            flexDirection: "column",
            gap: "5px",
          }}
        >
          {day.format("DD")}
          {!!total && (
            <Dot sx={{ mt: "-2.5px" }} side={dotSide} color={getDotColor()} />
          )}
        </Center>
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {renderInner()}
      </Popover>
    </>
  );
};

export default Day;
