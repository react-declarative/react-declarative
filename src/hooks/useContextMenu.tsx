import * as React from "react";
import { useState } from "react";

import { makeStyles } from "../styles";

import Async, { IAsyncProps } from "../components/Async";

import CircularProgress from "@mui/material/CircularProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";

import useActualCallback from "./useActualCallback";
import useAsyncAction from "./useAsyncAction";
import useActualValue from "./useActualValue";

import IOption from "../model/IOption";
import TSubject from "../model/TSubject";

import { sleep } from "../utils/sleep";

interface IParams<T extends any = object> {
  keepMounted?: boolean;
  options: Partial<IOption>[];
  onAction?: (action: string) => void;
  fallback?: (e: Error) => void;
  deps?: any[];
  throwError?: boolean;
  reloadSubject?: TSubject<void>;
  payload?: IAsyncProps<T>["payload"];
  onLoadStart?: IAsyncProps<T>["onLoadStart"];
  onLoadEnd?: IAsyncProps<T>["onLoadEnd"];
  BeforeContent?: React.ComponentType<any>;
  AfterContent?: React.ComponentType<any>;
}

interface IResult {
  elementProps: {
    onContextMenu: React.MouseEventHandler<HTMLDivElement>;
  };
  render: () => React.ReactNode;
}

const MENU_MIN_WIDTH = 225;

const useStyles = makeStyles()({
  container: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    maxHeight: '45vh',
    overflowY: 'auto',
    overflowX: 'hidden',
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

export const useContextMenu = <T extends any = object>({
  keepMounted = false,
  AfterContent,
  BeforeContent,
  deps,
  payload,
  onLoadStart,
  onLoadEnd,
  onAction = () => undefined,
  options = [],
  fallback,
  reloadSubject,
  throwError,
}: IParams<T>): IResult => {
  const { classes } = useStyles();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(0);

  const onAction$ = useActualCallback(onAction);
  const options$ = useActualValue(options);

  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => Math.max(loading - 1, 0));
    onLoadEnd && onLoadEnd(isOk);
  };

  const { execute: handleAction } = useAsyncAction(onAction$, {
    onLoadStart: handleLoadStart,
    onLoadEnd: handleLoadEnd,
    throwError,
    fallback,
  });

  const handleClick = (item: string) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleAction(item);
    setAnchorEl(null);
  };

  const render = () => {
    return (
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
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
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
              <CircularProgress size={14} />
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
            {options$.current.map(
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
                const Placeholder = () =>
                  !divider ? (
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
                      await sleep(0);
                      const disabled = await isDisabled(payload);
                      const visible = await isVisible(payload);
                      if (visible) {
                        if (divider) {
                          return <Divider orientation="horizontal" />;
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
    );
  };

  return {
    elementProps: {
      onContextMenu: (e) => {
        if (!options$.current.length) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const pointElement = document.elementFromPoint(e.clientX, e.clientY);
        if (pointElement) {
          setAnchorEl(pointElement as unknown as HTMLDivElement);
        } else {
          setAnchorEl(e.target as HTMLDivElement);
        }
      },
    },
    render,
  } as const;
};

export default useContextMenu;
