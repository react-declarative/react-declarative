import * as React from "react";
import { useState, useRef } from "react";

import { SxProps, alpha, Theme, Divider } from "@mui/material";
import { makeStyles } from "../../styles";

import classNames from "../../utils/classNames";
import sleep from "../../utils/sleep";

import Async, { IAsyncProps } from "../Async";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import CircularProgress from "@mui/material/CircularProgress";

import useActualCallback from "../../hooks/useActualCallback";
import useAsyncAction from "../../hooks/useAsyncAction";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Fab from "@mui/material/Fab";

import IOption from "../../model/IOption";
import TSubject from "../../model/TSubject";

/**
 * Represents the properties of the ActionMenu component.
 *
 * @template T - The type of payload.
 */
export interface IActionMenuProps<T extends any = object> {
  keepMounted?: boolean;
  options?: Partial<IOption>[];
  transparent?: boolean;
  disabled?: boolean;
  onAction?: (action: string) => void;
  onToggle?: (opened: boolean) => void;
  fallback?: (e: Error) => void;
  deps?: any[];
  throwError?: boolean;
  className?: string;
  reloadSubject?: TSubject<void>;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  payload?: IAsyncProps<T>["payload"];
  onLoadStart?: IAsyncProps<T>["onLoadStart"];
  onLoadEnd?: IAsyncProps<T>["onLoadEnd"];
  BeforeContent?: React.ComponentType<any>;
  AfterContent?: React.ComponentType<any>;
}

const MENU_MIN_WIDTH = 225;

/**
 * Returns the styles object for a component using the makeStyles hook.
 *
 * @returns The styles object.
 */
const useStyles = makeStyles()({
  root: {
    zIndex: "unset !important",
  },
  container: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '45vh',
    scrollbarWidth: 'none',
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  beforeContent: {
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *": {
      flex: 1,
    },
  },
  afterContent: {
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *": {
      flex: 1,
    },
  },
});

/**
 * ActionMenu is a component that displays a menu of options triggered by a button click.
 *
 * @template T - The type of payload passed to the action.
 *
 * @param options - An array of option objects that define the content and behavior of each menu option.
 * @param transparent - Determines whether the menu button should have a transparent style.
 * @param disabled - Determines whether the menu should be disabled and not respond to user interactions.
 * @param throwError - Determines whether to throw an error when an asynchronous action fails.
 * @param fallback - The fallback content to display when an asynchronous action fails.
 * @param onToggle - A callback function to handle the menu open/close state change event.
 * @param onAction - A callback function to handle the execution of an action when a menu option is clicked.
 * @param payload - A payload object to pass to the action callback function.
 * @param className - Additional CSS class name(s) to apply to the menu button.
 * @param style - Additional inline styles to apply to the menu button.
 * @param sx - Additional Stylsx object to apply to the menu button.
 * @param deps - An array of dependencies to update the menu when changed.
 * @param onLoadStart - A callback function to handle the start of an asynchronous action.
 * @param onLoadEnd - A callback function to handle the end of an asynchronous action.
 * @param keepMounted - Determines whether to keep the menu mounted in the DOM even when closed.
 * @param BeforeContent - The content to display before the menu options.
 * @param AfterContent - The content to display after the menu options.
 * @param reloadSubject - A subject that triggers the reload of the menu options.
 *
 * @returns - The rendered ActionMenu component.
 */
export const ActionMenu = <T extends any = object>({
  options = [],
  transparent = false,
  disabled = false,
  throwError = false,
  fallback,
  onToggle,
  onAction = () => null,
  payload,
  className,
  style,
  sx,
  deps,
  onLoadStart,
  onLoadEnd,
  keepMounted,
  BeforeContent,
  AfterContent,
  reloadSubject,
}: IActionMenuProps<T>) => {
  const targetRef = useRef<HTMLButtonElement | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(0);

  const { classes } = useStyles();

  const onAction$ = useActualCallback(onAction);

  /**
   * Increases the loading count and triggers the `onLoadStart` event.
   * @function handleLoadStart
   * @memberof [namespace]
   * @returns
   */
  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  /**
   * Decreases the loading counter by 1 and invokes the onLoadEnd callback if provided.
   *
   * @param isOk - Flag indicating if the load operation was successful or not.
   * @returns
   */
  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => Math.max(loading - 1, 0));
    onLoadEnd && onLoadEnd(isOk);
  };

  const {
    execute: handleAction,
  } = useAsyncAction(onAction$, {
    onLoadStart: handleLoadStart,
    onLoadEnd: handleLoadEnd,
    throwError,
    fallback,
  });

  /**
   * Handles focus event.
   *
   * @param e - The event object.
   */
  const handleFocus = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(targetRef.current);
    onToggle && onToggle(true);
  };

  /**
   * Handles the close event.
   * @param e - The event object.
   * @returns
   */
  const handleClose = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(null);
    setLoading(0);
    onToggle && onToggle(false);
  };

  /**
   * Function to handle click event.
   *
   * @param item - The item to be handled.
   *
   * @returns The click event handler function.
   */
  const handleClick = (item: string) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleAction(item);
    setAnchorEl(null);
    onToggle && onToggle(false);
  };

  return (
    <>
      <Fab
        ref={targetRef}
        className={classNames(className, classes.root)}
        style={style}
        sx={{
          ...(transparent ? ({
            boxShadow: "none !important",
            background: "transparent !important",
            color: (theme: Theme) => `${alpha(
              theme.palette.getContrastText(theme.palette.background.default),
              0.4
            )} !important`,
          }) : undefined),
          ...sx,
        }}
        disableFocusRipple={transparent}
        disableRipple={transparent}
        disabled={disabled || !!loading}
        size="small"
        color="primary"
        aria-label="more"
        aria-haspopup="true"
        onClick={handleFocus}
      >
        <MoreVertIcon color="inherit" />
      </Fab>
      <Menu
        keepMounted={keepMounted}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        anchorEl={disabled ? null : anchorEl}
        open={!!anchorEl && !disabled}
        onClose={handleClose}
        MenuListProps={{
          disablePadding: true,
          sx: {
            pt: BeforeContent ? 0 : 1,
            pb: AfterContent ? 0 : 1,
          },
        }}
      >
        <Box className={classes.container}>
          {loading !== 0 && (
            <Box className={classes.loader}>
              <CircularProgress />
            </Box>
          )}
          <Box
            className={classes.content}
            sx={{
              visibility: loading !== 0 ? "hidden" : "visible",
            }}
          >
            {BeforeContent && (
              <Box className={classes.beforeContent}>
                <BeforeContent />
              </Box>
            )}
            {options.map(
              (
                {
                  label = "unknown-label",
                  action = "unknown-action",
                  divider,
                  icon: Icon,
                  isDisabled = () => false,
                  isVisible = () => true,
                },
                idx
              ) => {
                const Placeholder = () => !divider ? (
                  <MenuItem
                    sx={{
                      visibility: "hidden",
                      minWidth: MENU_MIN_WIDTH,
                    }}
                  >
                    {!!Icon && (
                      <ListItemIcon>
                        <Icon />
                      </ListItemIcon>
                    )}
                    <Typography variant="inherit">{label}</Typography>
                  </MenuItem>
                ) : null;
                return (
                  <Async<T>
                    Loader={Placeholder}
                    throwError={throwError}
                    fallback={fallback}
                    key={idx}
                    onLoadStart={handleLoadStart}
                    onLoadEnd={handleLoadEnd}
                    reloadSubject={reloadSubject}
                    deps={deps}
                    payload={payload}
                  >
                    {async (payload) => {
                      /** mui v5 menu invalid position quickfix */
                      await sleep(250);
                      const disabled = await isDisabled(payload);
                      const visible = await isVisible(payload);
                      if (visible) {
                        if (divider) {
                          return <Divider orientation="horizontal" />
                        }
                        return (
                          <MenuItem
                            disabled={disabled}
                            onClick={handleClick(action)}
                            sx={{
                              minWidth: MENU_MIN_WIDTH,
                            }}
                          >
                            {!!Icon && (
                              <ListItemIcon>
                                <Icon />
                              </ListItemIcon>
                            )}
                            <Typography variant="inherit">{label}</Typography>
                          </MenuItem>
                        );
                      } else {
                        return null;
                      }
                    }}
                  </Async>
                );
              }
            )}
            {AfterContent && (
              <Box className={classes.afterContent}>
                <AfterContent />
              </Box>
            )}
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default ActionMenu;
