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

/**
 * Represents the properties for a card item component.
 *
 * @template ItemData - The type of the item data.
 */
interface ICardItemProps<ItemData extends IItemData = any> extends PaperProps {
  item: ItemData;
}

/**
 * Formats a given value based on certain conditions and returns the formatted value.
 *
 * @param value - The value to be formatted.
 * @returns - The formatted value.
 */
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
  } else if (React.isValidElement(value)) {
    return value;
  } else if (isObject(value)) {
    return <pre>{JSON.stringify(value, null, 2)}</pre>;
  } else {
    return value;
  }
};

/**
 * Custom hook for generating styles using the makeStyles function from Material-UI.
 *
 * @returns The generated styles.
 */
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
    paddingBottom: 15,
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
  media: {
    width: '100%',
  },
  mediaPhone: {
    gridColumnStart: 1,
    gridColumnEnd: 2,
  },
  mediaTablet: {
    gridColumnStart: 1,
    gridColumnEnd: 3,
  },
  mediaDesktop: {
    gridColumnStart: 1,
    gridColumnEnd: 4,
  },
  textWrap: {
    whiteSpace: "break-spaces",
    overflowWrap: "break-word",
    textOverflow: "ellipsis",
    fontWeight: "bold",
  },
  titleLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "calc(100% - 80px)",
  },
  opacity: {
    opacity: 0.6,
  },
  stretch: {
    flex: 1,
  },
}));

/**
 * A component that represents an item in a card layout.
 *
 * @template ItemData - The type of data for the item.
 * @param params - The parameters for the component.
 * @param ref - A reference to the component's root element.
 * @returns - The rendered component.
 */
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
    formatMedia = () => undefined,
    formatKey = (k) => keyToTitle(String(k)),
    formatValue = (_, v) => defaultFormatter(v),
    formatCardLabel = ({ id }) => `Id: ${id}`,
    onCardClick = () => undefined,
    onAction = () => undefined,
    throwError = false,
  } = usePropsContext();
  const { isPhone, isTablet, isDesktop } = useMediaContext();
  const { toggleSelection } = useSelectionContext();

  /**
   * useMemo to transform an object into an array of key-value pairs
   * and optionally filter the desired fields.
   *
   * @param callback - The callback function to be memoized.
   * @param dependencies - The dependencies array to trigger memoization.
   * @returns - The transformed and filtered array of entries.
   */
  const entries = useMemo(() => {
    let result = Object.entries(item);
    if (pickFields) {
      result.filter(([key]) => pickFields.includes(key));
    }
    return result;
  }, [pickFields]);

  /**
   * Represents the media for a card item.
   *
   * @type {Object}
   * @property cardMedia - A memoized function that returns the formatted media for the card item.
   * @property cardMedia.formatMedia - A function that formats the media for the card item.
   * @property cardMedia.item - The item used to format the media.
   *
   * @param item - The item that is used to format the media.
   * @returns The media for the card item.
   */
  const cardMedia = useMemo(() => {
    return formatMedia(item);
  }, [item])

  /**
   * Executes a callback function when the handleClick event is triggered.
   *
   * @callback handleClick
   * @param onCardClick - The callback function to be executed when the card is clicked.
   * @param state - The state object.
   * @param state.menuOpened - The flag whether the menu is opened.
   * @param item - The item object.
   * @param item - The item value.
   * @returns
   */
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
      <Paper className={classNames(classes.container)}>
        <Box className={classes.header}>
          <Checkbox
            onClick={() => toggleSelection(item.id)}
            checked={state.selectedIds.has(item.id)}
          />
          <Typography className={classes.titleLabel} variant="body1">{formatCardLabel(item)}</Typography>
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
        <Box className={classes.content} onClick={handleClick}>
          <Box
            className={classNames(classes.inner, {
              [classes.innerPhone]: isPhone,
              [classes.innerTablet]: isTablet,
              [classes.innerDesktop]: isDesktop,
            })}
          >
            {!!cardMedia && (
              <Box
                className={classNames(classes.media, {
                  [classes.mediaPhone]: isPhone,
                  [classes.mediaTablet]: isTablet,
                  [classes.mediaDesktop]: isDesktop,
                })}
              >
                {cardMedia}
              </Box>
            )}
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
