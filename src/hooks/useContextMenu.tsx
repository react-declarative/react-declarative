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

/**
 * Represents the parameters for a certain action.
 * @template T - The type of the payload object.
 */
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

/**
 * @interface IResult
 * Represents the interface for a context menu.
 * @property elementProps - The properties for the result element.
 * @property elementProps.onContextMenu - The callback function for the context menu event.
 * @property render - The function that renders the result.
 */
interface IResult {
  elementProps: {
    onContextMenu: React.MouseEventHandler<HTMLDivElement>;
  };
  render: () => React.ReactNode;
}

const MENU_MIN_WIDTH = 225;

/**
 * Returns the styles object for a component with the given classes.
 */
const useStyles = makeStyles()({
  container: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    maxHeight: '45vh',
    scrollbarWidth: 'none',
    "&::-webkit-scrollbar": {
      display: "none",
    },
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

/**
 * Represents a utility for displaying a context menu.
 *
 * @template T - The type of the payload object.
 *
 * @param params - The parameters for configuring the context menu.
 * @param [params.keepMounted=false] - Flag indicating if the menu should remain mounted when closed.
 * @param [params.AfterContent] - The component to render after the menu items.
 * @param [params.BeforeContent] - The component to render before the menu items.
 * @param [params.deps] - Dependencies to trigger reload of menu items.
 * @param [params.payload] - The payload object to pass to menu item handlers.
 * @param [params.onLoadStart] - The callback to invoke when the menu items start loading.
 * @param [params.onLoadEnd] - The callback to invoke when the menu items finish loading.
 * @param [params.onAction=() => undefined] - The callback to invoke when a menu item is clicked.
 * @param [params.options=[]] - The array of options to render as menu items.
 * @param [params.fallback] - The component to render as a fallback during loading.
 * @param [params.reloadSubject] - The subject to trigger a reload of menu items.
 * @param [params.throwError] - Flag indicating if an error should be thrown on loading failures.
 *
 * @returns - The object containing the properties and methods for rendering the context menu.
 * @property elementProps - The properties to apply to the element that triggers the context menu.
 * @property render - The function to render the context menu component.
 */
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

  /**
   * Increases the loading count and triggers the onLoadStart callback.
   * @function handleLoadStart
   * @returns
   */
  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  /**
   * Function to handle the load end event.
   *
   * @param isOk - Indicates whether the load is successful or not.
   * @returns
   */
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

  /**
   * Handles the click event.
   *
   * @param item - The item being clicked.
   * @param e - The event object.
   * @returns
   */
  const handleClick = (item: string) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleAction(item);
    setAnchorEl(null);
  };

  /**
   * Renders a Menu component with custom behavior and styling.
   *
   * @returns The rendered Menu component.
   */
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
