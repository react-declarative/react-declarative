import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";

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
import Search from "@mui/icons-material/Search";

import IScaffoldGroup, { IScaffoldOption } from "../model/IScaffoldGroup";

import SideMenu from "./SideMenu";
import ScrollView from "../../ScrollView";
import IScaffoldProps from "../model/IScaffoldProps";

const DRAWER_WIDTH = 256;

const useStyles = makeStyles((theme) => ({
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
  offset: theme.mixins.toolbar,
  searchBox: {
    display: 'inline-flex',
    margin: 5,
    '& > *': {
      flex: 1,
    },
  },
  preventScroll: {},
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

interface IContentProps extends Omit<IScaffoldProps, keyof {
  roles: never;
  payload: never;
  throwError: never;
  fallback: never;
}> {
  roles?: string[];
}

export const Content = ({
  children,
  className,
  style,
  selected,
  title = 'Scaffold',
  options = [],
  colored = true,
  loader = false,
  roles: currentRoles,
  onOptionClick,
}: IContentProps) => {

  const rootRef = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);
  const classes = useStyles();

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

  useEffect(() => {
    const { current: root } = rootRef;
    const elements = root?.querySelectorAll(`.${classes.preventScroll}`) || [];
    const preventScroll = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
    };
    elements.forEach((el) => el.addEventListener('touchmove', preventScroll, {
      passive: false,
    }));
    return () => elements.forEach((el) => el.removeEventListener('touchmove', preventScroll));
  });

  return (
    <Box ref={rootRef} className={classNames(className, classes.root)} style={style}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        open={opened}
        onClose={() => setOpened(false)}
      >
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
                    <IconButton>
                      <Search />
                    </IconButton>
                  </div>
                </InputAdornment>
              ),
            }}
            name="search"
            type="text"
          />
        </Box>
        <SideMenu selected={selected} onClick={handleClick} options={filteredMenuOptions} />
      </Drawer>
      <AppBar
        className={classNames(classes.preventScroll, {
          [classes.appBarSolidPaper]: !colored,
        })}
        position="fixed"
      >
        <Toolbar>
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
        </Toolbar>
        {loader && (
          <Box className={classes.loaderBar}>
            <LinearProgress color="secondary" />
          </Box>
        )}
      </AppBar>
      <div className={classNames(classes.offset, classes.preventScroll)} />
      <ScrollView className={classes.container}>
        <Box p={1}>
          {children}
        </Box>
      </ScrollView>
    </Box>
  );
};

export default Content;
