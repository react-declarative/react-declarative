import * as React from "react";
import { useMemo, useCallback } from "react";
import { SxProps } from "@mui/system";

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

import MenuIcon from '@mui/icons-material/Menu';

interface IHeaderProps<T = Payload> extends StackProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
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

  const { dense = false, fixedHeader = false } = usePropsContext();

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
      label: id === 'unknown' ? appName : label,
      tabs: tabs as IScaffold2TabInternal[],
    };
  }, [activeOptionPath, options, appName]);

  const activeTabPath = useMemo(() => {
    const activeTab = tabs.find(({ active }) => active);
    if (activeTab) {
      return activeTab.path;
    }
    return upperActiveTabPath;
  }, [tabs, upperActiveTabPath]);

  const hasTabs = useMemo(() => {
    return !!tabs.filter(({ visible }) => visible).length;
  }, [tabs]);

  const handleTabChange = useCallback((path: string, tabId: string) => {
    onTabChange && onTabChange(path, tabId, id);
  }, [path, id]);

  return (
    <>
      <Stack
        className={className}
        style={style}
        sx={{
          width: '100%',
          zIndex: 999,
          ...(fixedHeader && {
            position: 'fixed',
            top: 0,
            left: isMobile ? 0 : '256px',
            width: isMobile ? '100%' : 'calc(100% - 256px)',
          }),
          ...(!fixedHeader && {
            position: 'sticky',
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
            pb: (hasTabs && !isMobile && !dense) ? 2 : 0,
          }}
        >
          <Toolbar variant={dense ? "dense" : "regular"}>
            <Grid container alignItems="center" wrap="nowrap" spacing={1}>
              <Grid sx={{ display: !dense ? { sm: 'none', xs: 'block' } : undefined }} item>
                <IconButton
                  sx={{
                    pointerEvents: isMobile ? 'inherit' : 'none',
                  }}
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  edge="start"
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
              <Grid item xs>
                {dense ? (
                  <>
                    {!hasTabs && (
                      <Typography color="inherit" variant="h5" component="h1">
                        {label || appName}
                      </Typography>
                    )}
                    {hasTabs && (
                      <Tabs
                        value={activeTabPath}
                        textColor="inherit"
                        indicatorColor="secondary"
                      >
                        {tabs
                          .filter(({ visible }) => visible)
                          .map(({ id, label, icon: Icon, disabled, path }, idx) => (
                            <Tab
                              sx={{
                                minWidth: 128,
                                fontWeight: 'bold',
                              }}
                              key={`${id}-${idx}`}
                              value={path}
                              label={label || idToLabel(id)}
                              onClick={() => handleTabChange(path, id)}
                              disabled={disabled}
                              icon={Icon && <Icon />}
                            />
                          )
                          )}
                      </Tabs>
                    )}
                  </>
                ) : (
                  <Typography color="inherit" variant="h5" component="h1">
                    {label || appName}
                  </Typography>
                )}
              </Grid>
              {!!actions?.length && (
                <Grid item>
                  <ActionMenu
                    transparent
                    sx={{
                      color: 'unset !important',
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
              value={activeTabPath}
              textColor="inherit"
              indicatorColor="secondary"
            >
              {tabs
                .filter(({ visible }) => visible)
                .map(({ id, label, icon: Icon, disabled, path }, idx) => (
                  <Tab
                    sx={{
                      minWidth: '128px',
                    }}
                    key={`${id}-${idx}`}
                    value={path}
                    label={label || idToLabel(id)}
                    onClick={() => handleTabChange(path, id)}
                    disabled={disabled}
                    icon={Icon && <Icon />}
                  />
                )
                )}
            </Tabs>
          </AppBar>
        )}
        {!!loading && (
          <Box
            sx={{
              marginTop: '-4px',
            }}
          >
            <LinearProgress
              variant={loading as unknown as number > 1 ? "determinate" : "indeterminate"}
              value={loading as unknown as number > 1 ? Number(loading) : undefined}
              color="primary"
            />
          </Box>
        )}
      </Stack>
      {!!fixedHeader && (
        <Box
          sx={{
            ...(dense && {
              paddingBottom: '48px',
            }),
            ...(!dense && {
              ...isMobile ? {
                ...hasTabs ? {
                  paddingBottom: '106px',
                } : {
                  paddingBottom: '56px',
                }
              } : {
                ...hasTabs ? {
                  paddingBottom: '128px',
                } : {
                  paddingBottom: '64px',
                }
              }
            })
          }}
        />
      )}
    </>
  );
};

export default Header;
