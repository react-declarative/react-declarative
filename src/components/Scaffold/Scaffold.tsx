import * as React from "react";
import { useState, useMemo } from "react";

import classNames from "../../utils/classNames";

import deepClone from '../../utils/deepClone';
import objects from '../../utils/objects';
import arrays from '../../utils/arrays';

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import { makeStyles } from "@material-ui/core";

import Menu from "@material-ui/icons/Menu";
import Search from "@material-ui/icons/Search";

import IMenuGroup, { IMenuOption } from "../../model/IMenuGroup";

import SideMenu from "./SideMenu";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  appBar: {
    background: theme.palette.background.paper,
    color: theme.palette.getContrastText(theme.palette.background.paper),
  },
  offset: theme.mixins.toolbar,
  hide: {
    display: 'none',
  },
  searchBox: {
    margin: 5,
  },
}));

interface IScaffoldProps {
  children: React.ReactChild;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
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
    <>
      <CssBaseline />
      <Drawer
        open={opened}
        onClose={() => setOpened(false)}
      >
        <TextField
          className={classes.searchBox}
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
        <SideMenu selected={selected} onClick={handleClick} options={filteredMenuOptions} />
      </Drawer>
      <AppBar
        className={classNames(classes.appBar, className)}
        position="fixed"
        style={style}
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
      <Box p={1}>
        <Grid container>
          {children}
        </Grid>
      </Box>
    </>
  );
};

Scaffold.displayName = "Scaffold";

export default Scaffold;
