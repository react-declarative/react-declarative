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
import classNames from "../../../utils/classNames";
import isToday from "../utils/isToday";

import ICalendarItem from "../model/ICalendarItem";

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

interface IDayProps {
  onChange: (date: dayjs.Dayjs) => void;
  isActive: boolean;
  day: dayjs.Dayjs;
}

export const Day = ({ onChange, day }: IDayProps) => {
  const { classes } = useStyles();

  const { BeforeDayHeader, AfterDayHeader } = usePropsContext();

  const [request] = useRequestContext();
  const {
    renderItem,
    payload,
    onLoadStart,
    onLoadEnd,
    fallback,
    rowMark,
    rowColor,
  } = usePropsContext();

  const [items, setItems] = useState<ICalendarItem[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const total = items.length;

  const currentStamp = useMemo(() => getMomentStamp(day), []);

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

  const getDotColor = () => {
    if (day.isBefore(dayjs().add(-1, "days"))) {
      return "red";
    }
    if (total > 3) {
      return "orange";
    }
    return "green";
  };

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
            sx={{
              height: "calc(356px - 48px)",
              width: "356px",
              maxHeight: "calc(45vh - 48px)",
            }}
            data={items}
            rowMark={rowMark}
            rowColor={rowColor}
            payload={payload}
          >
            {(props) =>
              createElement(renderItem, {
                ...props,
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
            <Dot sx={{ mt: "-2.5px" }} side={5} color={getDotColor()} />
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
