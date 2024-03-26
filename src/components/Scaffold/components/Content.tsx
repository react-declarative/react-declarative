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
import usePreventAutofill from "../../../hooks/usePreventAutofill";

import usePassthrough from "../hooks/usePassthrough";
import useLoaderLine from "../hooks/useLoaderLine";
import useLoader from "../hooks/useLoader";

import { LiftedProvider } from "../hooks/useLifted";

import SideMenu from "./SideMenu";

const DRAWER_WIDTH = 256;

/**
 * The `useStyles` variable is a function that returns an object containing CSS classes. These classes are created using the `makeStyles` function from the Material-UI library. The `
 *makeStyles` function is invoked with a single argument, which is an arrow function that defines the styles for the various selectors.
 *
 * The returned object contains the following CSS class names:
 *
 * - `root`: Represents the root element of the component. It has various flexbox properties applied to it to stretch the component to fill the available space.
 * - `container`: Represents a container element within the component. It has the `flex: 1` property applied to it to fill the remaining space within the component.
 * - `title`: Represents the title element within the component. It has the `flex-grow: 1` property applied to it to grow and fill the available space.
 * - `appBarSolidPaper`: Represents the app bar element within the component with a solid background color. It has the background color and text color set dynamically based on the theme
 *.
 * - `drawer`: Represents the drawer element within the component. It has a fixed width and its child element (MuiPaper) has the same width with an overflow-x set to hidden to prevent
 * horizontal scrolling.
 * - `loaderBar`: Represents the loading bar element within the component. It has a negative top margin to offset the component by 4 pixels.
 * - `offsetRegular`: Represents an offset element within the component with a regular (default) height of 64 pixels.
 * - `offsetDense`: Represents an offset element within the component with a dense (shorter) height of 48 pixels.
 * - `searchBox`: Represents a search box container element within the component. It has an inline-flex display and margins applied to it. Its child (TextField) elements have a flex
 *: 1 property applied to them to fill the available space.
 * - `beforeSearch`: Represents an element that comes before the search box within the component. It has a width and flex properties applied to it to stretch and fill the available space
 *. Its child elements have a flex: 1 property applied to them to fill the available space.
 * - `afterSearch`: Represents an element that comes after the search box within the component. It has a width and flex properties applied to it to stretch and fill the available space
 *. Its child elements have a flex: 1 property applied to them to fill the available space.
 *
 * @function
 * @returns {Object} The CSS classes as an object.
 */
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

/**
 * Flattens a menu hierarchy into a single-level array of items.
 * @param items - The menu items to flatten.
 * @param items[].options - The submenu options for the menu item.
 * @returns - The flattened menu items.
 */
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

/**
 * Filters the given array of options based on the provided keyword and current roles.
 *
 * @param options - The array of options to filter.
 * @param config - The configuration object.
 * @param config.keyword - The keyword to filter the options by.
 * @param [config.currentRoles] - The current roles to use for filtering.
 *
 * @returns - The filtered array of options.
 */
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

/**
 * Cleans up the menu by removing options that are not allowed.
 *
 * @param entry - The menu entry to clean up.
 * @param allowed - The set of allowed menu entries.
 */
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

/**
 * Interface representing the properties of a content component.
 * @template T - The type of the content component props.
 */
interface IContentProps<T extends any = any> extends Omit<IScaffoldProps<T>, keyof {
  roles: never;
  throwError: never;
  fallback: never;
}> {
  roles?: string[];
}

/**
 * Render the main content scaffold for the application.
 *
 * @template T - Type for the content
 * @param props - The component props
 * @param props.children - The content to be rendered inside the scaffold
 * @param [props.className] - Additional CSS class for the scaffold
 * @param [props.style] - Inline CSS styles for the scaffold
 * @param [props.selected] - Flag indicating if the scaffold is selected
 * @param [props.title='Scaffold'] - The title of the scaffold
 * @param [props.options=[]] - Array of menu options for the scaffold
 * @param [props.dense=false] - Flag indicating if the scaffold should be rendered in dense mode
 * @param [props.colored=true] - Flag indicating if the scaffold should be rendered with color
 * @param [props.actions] - Array of action options for the scaffold
 * @param [props.payload] - The payload data for the scaffold
 * @param [props.roles] - Array of roles for the scaffold
 * @param [props.onOptionClick] - Callback function when a menu option is clicked
 * @param [props.onAction] - Callback function when an action is triggered
 * @param [props.BeforeSearch] - Optional component to render above the search bar
 * @param [props.AfterSearch] - Optional component to render below the search bar
 * @param [props.AfterMenuContent] - Optional component to render after the menu content
 * @param [props.BeforeMenuContent] - Optional component to render before the menu content
 * @returns - The rendered scaffold component
 */
export const Content = <T extends any = any>({
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

  const preventAutofill = usePreventAutofill();

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
              {...preventAutofill}
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
