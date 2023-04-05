import * as React from "react";
import { useMemo, useCallback, useEffect } from "react";
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
  loader?: boolean | number;
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
  loader,
  options,
  isMobile,
  appName,
  activeOptionPath,
  activeTabPath,
  onDrawerToggle,
  onAction,
  onTabChange,
  BeforeMenuContent,
  AfterMenuContent,
  actions = [],
  ...otherProps
}: IHeaderProps<T>) => {

  const { dense = false } = usePropsContext();

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

  useEffect(() => {
    const availableTabs = tabs
      .filter(({ visible }) => visible)
      .filter(({ disabled }) => !disabled);
    if (!!availableTabs.length && !availableTabs.some(({ path }) => activeTabPath === path)) {
      onTabChange && onTabChange(path, availableTabs[0].id, id);
    }
  }, [activeTabPath, tabs]);

  const handleTabChange = useCallback((tabId: string) => {
    onTabChange && onTabChange(path, tabId, id);
  }, [path, id]);

  return (
    <Stack
      className={className}
      style={style}
      sx={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 999,
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
          pb: (!!tabs?.length && !isMobile) ? 2 : 0,
        }}
      >
        <Toolbar variant={dense ? "dense" : "regular"}>
          <Grid container alignItems="center" wrap="nowrap" spacing={1}>
            <Grid sx={{ display: !dense ? { sm: 'none', xs: 'block' } : undefined }} item>
              <IconButton
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
                  {!tabs.length && (
                    <Typography color="inherit" variant="h5" component="h1">
                      {label || appName}
                    </Typography>
                  )}
                  {!!tabs.length && (
                    <Tabs
                      value={activeTabPath}
                      textColor="inherit"
                      indicatorColor="secondary"
                    >
                        {tabs
                          .filter(({ visible }) => visible)
                          .map(({ id, label, icon: Icon, disabled }, idx) => (
                            <Tab
                              sx={{
                                minWidth: 128,
                                fontWeight: 'bold',
                              }}
                              key={`${id}-${idx}`}
                              value={id}
                              label={label || idToLabel(id)}
                              onClick={() => handleTabChange(id)}
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
      {!!tabs.length && !dense && (
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
                .map(({ id, label, icon: Icon, disabled }, idx) => (
                  <Tab
                    sx={{
                      minWidth: 128,
                    }}
                    key={`${id}-${idx}`}
                    value={id}
                    label={label || idToLabel(id)}
                    onClick={() => handleTabChange(id)}
                    disabled={disabled}
                    icon={Icon && <Icon />}
                  />
                )
              )}
          </Tabs>
        </AppBar>
      )}
      {!!loader && (
        <Box
          sx={{
            marginTop: '-4px',
          }}
        >
          <LinearProgress
            variant={loader > 1 ? "determinate" : "indeterminate"}
            value={loader > 1 ? Number(loader) : undefined}
            color="primary"
          />
        </Box>
      )}
    </Stack>
  );
};

export default Header;
