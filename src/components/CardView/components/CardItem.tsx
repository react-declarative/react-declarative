import * as React from "react";
import { forwardRef, useCallback, useMemo } from "react";

import { makeStyles } from "../../../styles";
import { darken } from "@mui/material";

import Paper, { PaperProps } from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import ActionMenu from "../../ActionMenu";

import IItemData from "../model/IItemData";

import useSelectionContext from "../context/SelectionContext";
import useMediaContext from "../../../hooks/useMediaContext";
import usePayloadContext from "../context/PayloadContext";
import useStateContext from "../context/StateContext";
import usePropsContext from "../context/PropsContext";

import classNames from "../../../utils/classNames";
import isObject from "../../../utils/isObject";
import keyToTitle from "../utils/keyToTitle";

export const MIN_ROW_HEIGHT = 225;

interface ICardItemProps<ItemData extends IItemData = any> extends PaperProps {
  item: ItemData;
}

const defaultFormatter = (value: React.ReactNode) => {
  if (
    value == null ||
    value === undefined ||
    value === "" ||
    value === "null"
  ) {
    return "—";
  } else if (typeof value === "boolean") {
    return String(value);
  } else if (isObject(value)) {
    return <pre>{JSON.stringify(value, null, 2)}</pre>;
  } else if (value.toString().startsWith("http")) {
    return (
      <a
        href={value.toString()}
        target="_blank"
        rel="noreferrer"
        style={{ wordBreak: "break-all" }}
      >
        {value}
      </a>
    );
  } else {
    return value;
  }
};

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    minHeight: MIN_ROW_HEIGHT,
  },
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 45,
    width: "100%",
    background: darken(theme.palette.background.paper, 0.06),
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  inner: {
    display: "grid",
    gridRowGap: "10px",
    gridColumnGap: "10px",
    paddingTop: 45,
  },
  innerPhone: {
    gridTemplateColumns: "1fr",
  },
  innerTablet: {
    gridTemplateColumns: "1fr 1fr",
  },
  innerDesktop: {
    gridTemplateColumns: "1fr 1fr 1fr",
  },
  textWrap: {
    whiteSpace: "break-spaces",
    overflowWrap: "break-word",
    textOverflow: "ellipsis",
    fontWeight: "bold",
  },
  opacity: {
    opacity: 0.6,
  },
  stretch: {
    flex: 1,
  },
}));

const CardItemInternal = <ItemData extends IItemData = any>(
  { item, className, style, sx, ...otherProps }: ICardItemProps<ItemData>,
  ref: React.Ref<HTMLDivElement>
) => {
  const { classes } = useStyles();
  const { state, action } = useStateContext();
  const payload = usePayloadContext();
  const {
    cardActions,
    pickFields,
    fallback,
    onLoadStart,
    onLoadEnd,
    formatKey = (k) => keyToTitle(String(k)),
    formatValue = (_, v) => defaultFormatter(v),
    formatCardLabel = ({ id }) => `Id: ${id}`,
    onCardClick = () => undefined,
    onAction = () => undefined,
    throwError = false,
  } = usePropsContext();
  const { isPhone, isTablet, isDesktop } = useMediaContext();
  const { toggleSelection } = useSelectionContext();

  const entries = useMemo(() => {
    let result = Object.entries(item);
    if (pickFields) {
      result.filter(([key]) => pickFields.includes(key));
    }
    return result;
  }, [pickFields]);

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
      <Paper className={classNames(classes.container)} onClick={handleClick}>
        <Box className={classes.header}>
          <Checkbox
            onClick={() => toggleSelection(item.id)}
            checked={state.selectedIds.has(item.id)}
          />
          <Typography variant="body1">{formatCardLabel(item)}</Typography>
          <div className={classes.stretch} />
          {!!cardActions?.length && (
            <ActionMenu
              transparent
              options={cardActions.map(
                ({
                  isDisabled = () => false,
                  isVisible = () => true,
                  ...other
                }) => ({
                  ...other,
                  isVisible: () => isVisible(item, payload),
                  isDisabled: () => isDisabled(item, payload),
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
              deps={[payload]}
            />
          )}
        </Box>
        <Box className={classes.content}>
          <Box
            className={classNames(classes.inner, {
              [classes.innerPhone]: isPhone,
              [classes.innerTablet]: isTablet,
              [classes.innerDesktop]: isDesktop,
            })}
          >
            {entries.map(([key, value], idx) => (
              <Stack className={classes.textWrap} key={`${key}-${idx}`}>
                <Typography className={classes.opacity} variant="caption">
                  {formatKey(key)}
                </Typography>
                <Typography variant="body1">
                  {formatValue(key, value)}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export const CardItem = forwardRef(CardItemInternal) as typeof CardItemInternal;

export default CardItem;
