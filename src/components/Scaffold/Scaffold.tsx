import * as React from "react";
import { useState, useMemo } from "react";

import classNames from "../../utils/classNames";

import deepClone from '../../utils/deepClone';
import objects from '../../utils/objects';
import arrays from '../../utils/arrays';

import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { makeStyles } from "../../styles";

import Menu from "@mui/icons-material/Menu";
import Search from "@mui/icons-material/Search";

import IMenuGroup, { IMenuOption } from "../../model/IMenuGroup";

import SideMenu from "./SideMenu";
import ScrollView from "../common/ScrollView";

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
  offset: theme.mixins.toolbar,
  searchBox: {
    display: 'inline-flex',
    margin: 5,
    '& > *': {
      flex: 1,
    },
  },
}));

interface IScaffoldProps {
  children: React.ReactChild;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  colored?: boolean;
  selected?: string;
  options?: IMenuGroup[];
  roles?: string[];
  onOptionClick?: (name: string) => void;
}

const flatifyMenu = (items: IMenuGroup[]) => {
  const result = [];
  while (items.length) {
    const [item, ...last] = items;
    item.options?.forEach((i) => last.push(i));
    result.push(item);
    items = last;
  }
  return result;
};

const filerFlatMenu = (options: IMenuOption[], {
  keyword,
  currentRoles,
} : {
  keyword: string;
  currentRoles?: string[];
}) => options
  .filter(item => item.label.toLowerCase().includes(keyword))
  .filter(({ roles = [] }) => !currentRoles || roles.find((role) => currentRoles.includes(role)));

const cleanupMenu = (entry: Partial<IMenuGroup>, allowed: Set<IMenuOption>) =>
  entry.options = entry.options?.filter((option: any) => {
    if (allowed.has(option)) {
      return true;
    } else if (option.options?.length) {
      cleanupMenu(option, allowed);
      return flatifyMenu(option.options).find((o) => allowed.has(o));
    } else {
      return false;
    }
  });

export const Scaffold = ({
  children,
  className,
  style,
  selected,
  title = 'Scaffold',
  options = [],
  colored = true,
  roles: currentRoles,
  onOptionClick,
}: IScaffoldProps) => {

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

  const filteredMenuOptions = useMemo<IMenuGroup[]>(() => {
    const allowed = new Set<IMenuOption>();
    const safeOptions = makeArray(arrays(deepClone(objects(options))));
    const keyword = filterText.toLowerCase();
    filerFlatMenu(flatifyMenu(safeOptions), { keyword, currentRoles })
      .forEach((o) => allowed.add(o));
    const entry = { options: safeOptions };
    cleanupMenu(entry, allowed);
    return entry.options;
  }, [filterText, currentRoles]);

  return (
    <Box className={classNames(className, classes.root)} style={style}>
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
        className={classNames({
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
      </AppBar>
      <div className={classes.offset} />
      <ScrollView className={classes.container}>
        <Box p={1}>
          <Grid container>
            {children}
          </Grid>
        </Box>
      </ScrollView>
    </Box>
  );
};

Scaffold.displayName = "Scaffold";

export default Scaffold;
