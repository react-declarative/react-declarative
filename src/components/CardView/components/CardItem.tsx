import * as React from "react";
import { forwardRef } from "react";

import { makeStyles } from "../../../styles";

import Paper, { PaperProps } from "@mui/material/Paper";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

import ActionMenu from "../../ActionMenu";

import IItemData from "../model/IItemData";

import useMediaContext from "../../../hooks/useMediaContext";

import classNames from "../../../utils/classNames";

interface ICardItemProps<ItemData extends IItemData = any> extends PaperProps {
  item: ItemData;
}

const useStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  container: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
  },
  content: {
    display: "grid",
    flex: 1,
  },
  phone: {
    gridTemplateColumns: "1fr",
  },
  tablet: {
    gridTemplateColumns: "1fr 1fr",
  },
  desktop: {
    gridTemplateColumns: "1fr 1fr 1fr",
  },
  checkbox: {
    position: "absolute",
    top: 3,
    left: 3,
  },
  menu: {
    position: "absolute",
    top: 3,
    right: 3,
  },
}));

const CardItemInternal = <ItemData extends IItemData = any>(
  { item, className, style, sx, ...otherProps }: ICardItemProps<ItemData>,
  ref: React.Ref<HTMLDivElement>
) => {
  const { classes } = useStyles();
  const { isPhone, isTablet, isDesktop } = useMediaContext();
  const entries = Object.entries(item);
  return (
    <Box
      ref={ref}
      className={classNames(className, classes.root)}
      style={style}
      sx={sx}
      {...otherProps}
    >
      <Paper className={classes.container}>
        <Checkbox className={classes.checkbox} />
        <Box className={classNames(classes.content, {
            [classes.phone]: isPhone,
            [classes.tablet]: isTablet,
            [classes.desktop]: isDesktop,
        })}>
          {entries.map(([key, value], idx) => (
            <ListItemText
              key={`${key}-${idx}`}
              primary={key}
              secondary={value}
            />
          ))}
        </Box>
        <ActionMenu
          className={classes.menu}
          transparent
          sx={{
            color: "inherit",
          }}
        />
      </Paper>
    </Box>
  );
};

export const CardItem = forwardRef(CardItemInternal) as typeof CardItemInternal;

export default CardItem;
