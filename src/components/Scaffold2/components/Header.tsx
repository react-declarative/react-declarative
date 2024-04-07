import * as React from "react";
import { useMemo, useCallback } from "react";
import { SxProps } from "@mui/material";

import { makeStyles } from "../../../styles";

import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Stack, { StackProps } from "@mui/material/Stack";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import ActionMenu from "../../ActionMenu";

import usePropsContext from "../context/PropsContext";

import { IScaffold2GroupInternal } from "../model/IScaffold2Group";
import { IScaffold2TabInternal } from "../model/IScaffold2Tab";

import IScaffold2Action from "../model/IScaffold2Action";
import Payload from "../model/Payload";

import deepFlat from "../utils/deepFlat";
import idToLabel from "../utils/idToLabel";

import MenuIcon from "@mui/icons-material/Menu";
import useMediaContext from "../../../hooks/useMediaContext";

/**
 * Represents the props for the Header component.
 * @template T - The type of the payload object.
 * @extends StackProps - Inherited props from Stack component.
 * @property [className] - Additional class name for the component.
 * @property [style] - Inline style for the component.
 * @property [sx] - Styled System props for custom styling.
 * @property [loading] - Loading state of the component.
 * @property [payload] - Payload object of type T.
 * @property isMobile - Indicates if the component is being rendered on a mobile device.
 * @property [appName] - Name of the application.
 * @property options - Array of internal scaffold group objects.
 * @property [actions] - Array of scaffold action objects.
 * @property [BeforeMenuContent] - React component to render before the menu content.
 * @property [AfterMenuContent] - React component to render after the menu content.
 * @property activeOptionPath - Active option path.
 * @property activeTabPath - Active tab path.
 * @property onDrawerToggle - Event handler for toggling the drawer.
 * @property [onAction] - Event handler for scaffold actions.
 * @property [onTabChange] - Event handler for tab changes.
 */
interface IHeaderProps<T = Payload> extends StackProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  loading?: boolean | number;
  payload?: T;
  isMobile: boolean;
  appName?: string;
  options: IScaffold2GroupInternal<T>[];
  actions?: IScaffold2Action<T>[];
  BeforeMenuContent?: React.ComponentType<any>;
  AfterMenuContent?: React.ComponentType<any>;
  activeOptionPath: string;
  activeTabPath: string;
  onDrawerToggle: () => void;
  onAction?: (name: string) => void;
  onTabChange?: (path: string, tab: string, id: string) => void;
}

const TAB_HEIGHT = 48;

/**
 * This variable represents the styles of tabs in a user interface.
 * The useStyles variable utilizes the makeStyles function to generate the styles.
 *
 * @type {Function}
 * @return {Object} - An object containing the styles for the tabs.
 */
const useStyles = makeStyles()({
  tabsRoot: {
    minHeight: TAB_HEIGHT,
    height: TAB_HEIGHT,
  },
  tabRoot: {
    minHeight: TAB_HEIGHT,
    height: TAB_HEIGHT,
  },
});

export const Header = <T extends Payload = Payload>({
  className,
  style,
  sx,
  payload,
  loading,
  options,
  isMobile,
  appName,
  activeOptionPath,
  activeTabPath: upperActiveTabPath,
  onDrawerToggle,
  onAction,
  onTabChange,
  BeforeMenuContent,
  AfterMenuContent,
  actions = [],
  ...otherProps
}: IHeaderProps<T>) => {
  const {
    dense = false,
    fixedHeader = false,
    BeforeActionMenu,
    AfterAppName,
  } = usePropsContext();

  const { isPhone } = useMediaContext();

  const { classes } = useStyles();

  const { id, path, label, tabs } = useMemo(() => {
    const totalOptions = deepFlat(options);
    const {
      id = "unknown",
      path = "unknown",
      label = idToLabel(id),
      tabs = [],
    } = totalOptions.find(({ path }) => activeOptionPath === path) || {};
    return {
      id,
      path,
      label: id === "unknown" ? appName : label,
      tabs: tabs as IScaffold2TabInternal[],
    };
  }, [activeOptionPath, options, appName]);

  /**
   * Computes the active tab path based on the given tabs and upperActiveTabPath.
   *
   * @param tabs - The array of tabs.
   * @param upperActiveTabPath - The upper active tab path.
   * @returns - The active tab path.
   */
  const activeTabPath = useMemo(() => {
    const activeTab = tabs.find(({ active }) => active);
    if (activeTab) {
      return activeTab.path;
    }
    return upperActiveTabPath;
  }, [tabs, upperActiveTabPath]);

  /**
   * Determines if there are any visible tabs.
   *
   * @returns - A boolean value indicating if there are any visible tabs.
   *
   * @param tabs - An array of tab objects.
   * @param tabs.visible - A flag indicating the visibility of the tab.
   *
   */
  const hasTabs = useMemo(() => {
    return !!tabs.filter(({ visible }) => visible).length;
  }, [tabs]);

  /**
   * Handles the tab change event.
   *
   * @param path - The new path of the tab.
   * @param tabId - The ID of the new tab.
   * @returns
   */
  const handleTabChange = useCallback(
    (path: string, tabId: string) => {
      onTabChange && onTabChange(path, tabId, id);
    },
    [path, id]
  );

  return (
    <>
      <Stack
        className={className}
        style={style}
        sx={{
          width: "100%",
          zIndex: 999,
          ...(fixedHeader && {
            position: "fixed",
            top: 0,
            left: isMobile ? 0 : "256px",
            width: isMobile ? "100%" : "calc(100% - 256px)",
          }),
          ...(!fixedHeader && {
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
          }),
          ...sx,
        }}
        alignItems="stretch"
        justifyContent="stretch"
        {...otherProps}
      >
        <AppBar
          component="div"
          color="primary"
          position="static"
          elevation={0}
          sx={{
            zIndex: 0,
            pb: hasTabs && !isMobile && !dense ? 2 : 0,
          }}
        >
          <Toolbar variant={dense ? "dense" : "regular"}>
            <Grid container alignItems="center" wrap="nowrap" spacing={1}>
              <Grid
                sx={{
                  display: !dense ? { sm: "none", xs: "block" } : undefined,
                }}
                item
              >
                <IconButton
                  sx={{
                    pointerEvents: isMobile ? "inherit" : "none",
                  }}
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  edge="start"
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
              <Grid item>
                {dense ? (
                  <>
                    {!hasTabs && (
                      <Typography
                        display={isPhone ? "none" : undefined}
                        whiteSpace="nowrap"
                        color="inherit"
                        variant="h5"
                        component="h1"
                      >
                        {label || appName}
                      </Typography>
                    )}
                    {hasTabs && (
                      <Tabs
                        variant="scrollable"
                        value={activeTabPath}
                        textColor="inherit"
                        indicatorColor="secondary"
                        classes={{
                          root: classes.tabsRoot,
                        }}
                      >
                        {tabs
                          .filter(({ visible }) => visible)
                          .map(
                            (
                              { id, label, icon: Icon, disabled, path },
                              idx
                            ) => (
                              <Tab
                                sx={{
                                  minWidth: 128,
                                  fontWeight: "bold",
                                }}
                                key={`${id}-${idx}`}
                                value={path}
                                label={label || idToLabel(id)}
                                onClick={() => handleTabChange(path, id)}
                                disabled={disabled}
                                icon={Icon && <Icon />}
                                iconPosition="start"
                                classes={{
                                  root: classes.tabRoot,
                                }}
                              />
                            )
                          )}
                      </Tabs>
                    )}
                  </>
                ) : (
                  <Typography
                    display={isPhone ? "none" : undefined}
                    whiteSpace="nowrap"
                    color="inherit"
                    variant="h5"
                    component="h1"
                  >
                    {label || appName}
                  </Typography>
                )}
              </Grid>
              {!!AfterAppName && (
                <Grid item>
                  <AfterAppName payload={payload} />
                </Grid>
              )}
              <Grid item xs />
              {!!BeforeActionMenu && (
                <Grid item>
                  <BeforeActionMenu payload={payload} />
                </Grid>
              )}
              {!!actions?.length && (
                <Grid item>
                  <ActionMenu
                    transparent
                    sx={{
                      color: "unset !important",
                      mr: -2,
                    }}
                    BeforeContent={BeforeMenuContent}
                    AfterContent={AfterMenuContent}
                    options={actions.map(
                      ({
                        isVisible = () => true,
                        isDisabled = () => false,
                        ...other
                      }) => ({
                        ...other,
                        isVisible: () => isVisible(payload!),
                        isDisabled: () => isDisabled(payload!),
                      })
                    )}
                    onAction={onAction}
                    payload={payload}
                  />
                </Grid>
              )}
            </Grid>
          </Toolbar>
        </AppBar>
        {hasTabs && !dense && (
          <AppBar
            component="div"
            position="static"
            elevation={0}
            sx={{ zIndex: 0 }}
          >
            <Tabs
              variant="scrollable"
              value={activeTabPath}
              textColor="inherit"
              indicatorColor="secondary"
              classes={{
                root: classes.tabsRoot,
              }}
            >
              {tabs
                .filter(({ visible }) => visible)
                .map(({ id, label, icon: Icon, disabled, path }, idx) => (
                  <Tab
                    sx={{
                      minWidth: "128px",
                    }}
                    key={`${id}-${idx}`}
                    value={path}
                    label={label || idToLabel(id)}
                    onClick={() => handleTabChange(path, id)}
                    disabled={disabled}
                    icon={Icon && <Icon />}
                    iconPosition="start"
                    classes={{
                      root: classes.tabRoot,
                    }}
                  />
                ))}
            </Tabs>
          </AppBar>
        )}
        {!!loading && (
          <Box
            sx={{
              marginTop: "-4px",
            }}
          >
            <LinearProgress
              variant={
                (loading as unknown as number) > 1
                  ? "determinate"
                  : "indeterminate"
              }
              value={
                (loading as unknown as number) > 1 ? Number(loading) : undefined
              }
              color="primary"
            />
          </Box>
        )}
      </Stack>
      {!!fixedHeader && (
        <Box
          sx={{
            ...(dense && {
              paddingBottom: "48px",
            }),
            ...(!dense && {
              ...(isMobile
                ? {
                    ...(hasTabs
                      ? {
                          paddingBottom: "106px",
                        }
                      : {
                          paddingBottom: "56px",
                        }),
                  }
                : {
                    ...(hasTabs
                      ? {
                          paddingBottom: "128px",
                        }
                      : {
                          paddingBottom: "64px",
                        }),
                  }),
            }),
          }}
        />
      )}
    </>
  );
};

export default Header;
