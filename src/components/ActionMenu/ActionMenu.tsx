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

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Fab from "@mui/material/Fab";

import IOption from "../../model/IOption";

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
  style?: React.CSSProperties;
  sx?: SxProps;
  payload?: IAsyncProps<T>["payload"];
  onLoadStart?: IAsyncProps<T>["onLoadStart"];
  onLoadEnd?: IAsyncProps<T>["onLoadEnd"];
  BeforeContent?: React.ComponentType<any>;
  AfterContent?: React.ComponentType<any>;
}

const MENU_MIN_WIDTH = 225;

const useStyles = makeStyles()({
  root: {
    zIndex: "unset !important",
  },
  container: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
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
}: IActionMenuProps<T>) => {
  const targetRef = useRef<HTMLButtonElement | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(0);

  const { classes } = useStyles();

  const handleAction = useActualCallback(onAction);

  const handleFocus = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(targetRef.current);
    onToggle && onToggle(true);
  };

  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => Math.max(loading - 1, 0));
    onLoadEnd && onLoadEnd(isOk);
  };

  const handleClose = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(null);
    setLoading(0);
    onToggle && onToggle(false);
  };

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
        disabled={disabled}
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
                    deps={deps}
                    payload={payload}
                  >
                    {async (payload) => {
                      /** mui v5 menu invalid position quickfix */
                      await sleep(0);
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
