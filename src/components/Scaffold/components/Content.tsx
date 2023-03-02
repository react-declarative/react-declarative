import * as React from "react";
import { useState, useMemo } from "react";

import classNames from "../../../utils/classNames";

import deepClone from '../../../utils/deepClone';
import objects from '../../../utils/objects';
import arrays from '../../../utils/arrays';

import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import LinearProgress from "@mui/material/LinearProgress";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { makeStyles } from "../../../styles";

import Menu from "@mui/icons-material/Menu";
import Close from '@mui/icons-material/Close';
import Search from "@mui/icons-material/Search";

import ScrollView from "../../ScrollView";
import ActionMenu from "../../ActionMenu";

import IScaffoldGroup, { IScaffoldOption } from "../model/IScaffoldGroup";
import IScaffoldProps from "../model/IScaffoldProps";

import useActualCallback from "../../../hooks/useActualCallback";

import usePassthrough from "../hooks/usePassthrough";
import useLoaderLine from "../hooks/useLoaderLine";
import useLoader from "../hooks/useLoader";

import SideMenu from "./SideMenu";
import { LiftedProvider } from "../hooks/useLifted";

const DRAWER_WIDTH = 256;

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    flexDirection: 'column',
    minHeight: '100vh',
    maxHeight: '100vh',
    minWidth: '100vw',
    maxWidth: '100vw',
  },
  container: {
    flex: 1,
  },
  title: {
    flexGrow: 1,
  },
  appBarSolidPaper: {
    background: `${theme.palette.background.paper} !important`,
    color: `${theme.palette.getContrastText(theme.palette.background.paper)} !important`,
  },
  drawer: {
    width: DRAWER_WIDTH,
    '& > .MuiPaper-root': {
      width: DRAWER_WIDTH,
      overflowX: 'hidden',
    },
  },
  loaderBar: {
    marginTop: -4,
  },
  offsetRegular: {
    minHeight: 64,
  },
  offsetDense: {
    minHeight: 48,
  },
  searchBox: {
    display: 'inline-flex',
    margin: 5,
    '& > *': {
      flex: 1,
    },
  },
  beforeSearch: {
    width: 'calc(100% - 10px)',
    margin: '5px',
    marginBottom: '0px',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    '& > *': {
      flex: 1,
    },
  },
  afterSearch: {
    width: 'calc(100% - 10px)',
    margin: '5px',
    marginTop: '0px',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    '& > *': {
      flex: 1,
    },
  },
}));

const flatifyMenu = (items: IScaffoldGroup[]) => {
  const result = [];
  while (items.length) {
    const [item, ...last] = items;
    item.options?.forEach((i) => last.push(i));
    result.push(item);
    items = last;
  }
  return result;
};

const filerFlatMenu = (options: IScaffoldOption[], {
  keyword,
  currentRoles,
} : {
  keyword: string;
  currentRoles?: string[];
}) => options
  .filter(item => item.label.toLowerCase().includes(keyword))
  .filter(({ roles = [] }) => !currentRoles || roles.some((role) => currentRoles.includes(role)))
  .filter(({ visible = true }) => visible);

const cleanupMenu = (entry: Partial<IScaffoldGroup>, allowed: Set<IScaffoldGroup>) =>
  entry.options = entry.options?.filter((option: any) => {
    if (option.options?.length && option.visible !== false) {
      cleanupMenu(option, allowed);
      return flatifyMenu(option.options).some((o) => allowed.has(o));
    } else if (allowed.has(option)) {
      return true;
    } else {
      return false;
    }
  });

interface IContentProps<T extends any = string> extends Omit<IScaffoldProps<T>, keyof {
  roles: never;
  throwError: never;
  fallback: never;
}> {
  roles?: string[];
}

export const Content = <T extends any = string>({
  children,
  className,
  style,
  selected,
  title = 'Scaffold',
  options = [],
  dense = false,
  colored = true,
  actions,
  payload,
  roles: currentRoles,
  onOptionClick,
  onAction = () => null,
  BeforeSearch,
  AfterSearch,
  AfterMenuContent,
  BeforeMenuContent,
}: IContentProps<T>) => {

  const withPassthrough = usePassthrough();
  const loaderLine = useLoaderLine();
  const loader = useLoader();

  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();

  const handleMenuToggle = () => setOpened(!opened);

  const handleClose = () => {
    setOpened(false);
  };

  const handleClick = (name: string) => {
    handleClose();
    onOptionClick && onOptionClick(name);
  };

  const makeArray = (obj: any) => {
    if (Array.isArray(obj)) {
      return obj;
    } else {
      return [];
    }
  };

  const [filterText, setFilterText] = useState('');

  const filteredMenuOptions = useMemo<IScaffoldGroup[]>(() => {
    const allowed = new Set<IScaffoldOption>();
    const safeOptions = makeArray(arrays(deepClone(objects(options))));
    const keyword = filterText.toLowerCase();
    filerFlatMenu(flatifyMenu(safeOptions), { keyword, currentRoles })
      .forEach((o) => allowed.add(o));
    const entry = { options: safeOptions };
    cleanupMenu(entry, allowed);
    return entry.options;
  }, [filterText, currentRoles]);

  const handleAction = useActualCallback(onAction);

  if (withPassthrough) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <LiftedProvider payload={!!filterText}>
      <Box className={classNames(className, classes.root)} style={style}>
        <CssBaseline />
        <Drawer
          className={classes.drawer}
          open={opened}
          onClose={() => setOpened(false)}
        >
          {BeforeSearch && (
            <Box className={classes.beforeSearch}>
              <BeforeSearch />
            </Box>
          )}
          <Box className={classes.searchBox}>
            <TextField
              variant="standard"
              onChange={({ target }) => setFilterText(target.value.toString())}
              value={filterText}
              placeholder="Search"
              InputProps={{
                autoComplete: 'off',
                endAdornment: (
                  <InputAdornment position="end">
                    <div style={{ marginRight: -10 }}>
                      <IconButton onClick={() => setFilterText('')}>
                        {filterText ? (
                          <Close />
                        ) : (
                          <Search />
                        )}
                      </IconButton>
                    </div>
                  </InputAdornment>
                ),
              }}
              name="search"
              type="text"
            />
          </Box>
          {AfterSearch && (
            <Box className={classes.afterSearch}>
              <AfterSearch />
            </Box>
          )}
          <SideMenu selected={selected} onClick={handleClick} options={filteredMenuOptions} />
        </Drawer>
        <AppBar
          className={classNames({
            [classes.appBarSolidPaper]: !colored,
          })}
          position="fixed"
        >
          <Toolbar disableGutters variant={dense ? "dense" : "regular"}>
            <IconButton
              color="inherit"
              onClick={handleMenuToggle}
            >
              <Menu />
            </IconButton>
            <Typography
              variant="h6"
              className={classes.title}
            >
              {title}
            </Typography>
            {!!actions?.length && (
              <ActionMenu
                transparent
                sx={{
                  color: 'inherit',
                }}
                payload={payload}
                options={actions.map(({
                  isVisible = () => true,
                  isDisabled = () => false,
                  ...other
                }) => ({
                  ...other,
                  isVisible: () => isVisible(payload!),
                  isDisabled: () => isDisabled(payload!),
                }))}
                onAction={handleAction}
                AfterContent={AfterMenuContent}
                BeforeContent={BeforeMenuContent}
              />
            )}
          </Toolbar>
          {loaderLine && (
            <Box className={classes.loaderBar}>
              <LinearProgress
                variant={loader === -1 ? "indeterminate" : "determinate"}
                value={loader === -1 ? undefined : loader}
                color="primary"
              />
            </Box>
          )}
        </AppBar>
        <div className={classNames({
          [classes.offsetRegular]: !dense,
          [classes.offsetDense]: dense,
        })} />
        <ScrollView className={classes.container}>
          <Box p={1}>
            {children}
          </Box>
        </ScrollView>
      </Box>
    </LiftedProvider>
  );
};

export default Content;
