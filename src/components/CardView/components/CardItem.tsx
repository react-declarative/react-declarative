import * as React from "react";
import { forwardRef, useCallback } from "react";

import { makeStyles } from "../../../styles";

import Paper, { PaperProps } from "@mui/material/Paper";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

import ActionMenu from "../../ActionMenu";

import IItemData from "../model/IItemData";

import useMediaContext from "../../../hooks/useMediaContext";
import useStateContext from "../context/StateContext";
import usePropsContext from "../context/PropsContext";

import classNames from "../../../utils/classNames";
import isObject from "../../../utils/isObject";
import keyToTitle from "../utils/keyToTitle";

interface ICardItemProps<ItemData extends IItemData = any> extends PaperProps {
  item: ItemData;
}

const defaultFormatter = (value: React.ReactNode) => {
  if (value == null || value === undefined || value === '' || value === 'null') {
    return '—';
  } else if (typeof value === 'boolean') {
    return String(value);
  } else if (isObject(value)) {
    return (
      <pre>
        {JSON.stringify(value, null , 2)}
      </pre>
    );
  } else if (value.toString().startsWith('http')) {
    return (
      <a
        href={value.toString()}
        target="_blank"
        rel="noreferrer"
        style={{ wordBreak: 'break-all' }}
      >
        {value}
      </a>
    );
  } else {
    return value;
  }
};

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
    gridRowGap: "10px",
    gridColumnGap: "10px",
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
  textWrap: {
    whiteSpace: 'break-spaces',
    overflowWrap: 'break-word',
    textOverflow: 'ellipsis',
    fontWeight: 'bold',
  },
}));

const CardItemInternal = <ItemData extends IItemData = any>(
  { item, className, style, sx, ...otherProps }: ICardItemProps<ItemData>,
  ref: React.Ref<HTMLDivElement>
) => {
  const { classes } = useStyles();
  const { state, action } = useStateContext();
  const { 
    cardActions,
    fallback,
    onLoadStart,
    onLoadEnd,
    formatKey = (k) => keyToTitle(String(k)),
    formatValue = (_, v) => defaultFormatter(v),
    onCardClick = () => undefined,
    onAction = () => undefined,
    throwError = false,
  } = usePropsContext();
  const { isPhone, isTablet, isDesktop } = useMediaContext();
  const entries = Object.entries(item);

  const handleCheckboxToggle = useCallback(() => {
    const pendingSelectedIds = new Set(state.selectedIds);
    if (pendingSelectedIds.has(item.id)) {
      pendingSelectedIds.delete(item.id);
    } else {
      pendingSelectedIds.add(item.id);
    }
    action.setSelectedIds(pendingSelectedIds);
  }, [state, action, item]);

  const handleClick = useCallback(() => {
    if (!state.menuOpened) {
      onCardClick(item);
    }
  }, [state, item, onCardClick]);

  return (
    <Box
      ref={ref}
      className={classNames(className, classes.root)}
      style={style}
      sx={sx}
      {...otherProps}
    >
      <Paper
        className={classes.container}
        onClick={handleClick}
      >
        <Checkbox
          className={classes.checkbox}
          onClick={handleCheckboxToggle}
          checked={state.selectedIds.has(item.id)}
        />
        <Box
          className={classNames(classes.content, {
            [classes.phone]: isPhone,
            [classes.tablet]: isTablet,
            [classes.desktop]: isDesktop,
          })}
        >
          {entries.map(([key, value], idx) => (
            <ListItemText
              className={classes.textWrap}
              key={`${key}-${idx}`}
              primary={formatKey(key)}
              secondary={formatValue(key, value)}
            />
          ))}
        </Box>
        {!!cardActions?.length && (
          <ActionMenu
            className={classes.menu}
            options={cardActions.map(
              ({
                isDisabled = () => false,
                isVisible = () => true,
                ...other
              }) => ({
                ...other,
                isVisible: () => isVisible(item),
                isDisabled: () => isDisabled(item),
              })
            )}
            onToggle={action.setMenuOpened}
            onAction={(action) => onAction(action, item)}
            fallback={fallback}
            payload={item}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            throwError={throwError}
            sx={{
              color: "inherit",
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export const CardItem = forwardRef(CardItemInternal) as typeof CardItemInternal;

export default CardItem;
