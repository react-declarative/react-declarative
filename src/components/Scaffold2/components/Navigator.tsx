import * as React from "react";
import { Theme, alpha } from "@mui/material";

import Divider from "@mui/material/Divider";
import SwipeableDrawer, {
  SwipeableDrawerProps,
} from "@mui/material/SwipeableDrawer";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import SearchIcon from "@mui/icons-material/Search";

import { IScaffold2GroupInternal } from "../model/IScaffold2Group";
import Payload from "../model/Payload";

import usePropsContext from "../context/PropsContext";
import useUserAgent from "../../../hooks/useUserAgent";

import idToLabel from "../utils/idToLabel";

import MenuOption from "./MenuOption";
import Search from "./Search";

export const DRAWER_BACKGROUND = "react-declarative__scaffold2Background";

/**
 * @typedef Theme
 *
 * @typedef itemCategory
 * @property boxShadow - A function that calculates the box shadow value for the item category.
 * @param theme - The theme to be used for the calculation.
 * @returns - The calculated box shadow value.
 *
 * @property py - The padding on the y-axis for the item category.
 *
 * @property px - The padding on the x-axis for the item category.
 */
const itemCategory = {
  boxShadow: (theme: Theme) => {
    const color = alpha(theme.palette.background.default, 0.1);
    return `0 -1px 0 ${color} inset`;
  },
  py: 1.5,
  px: 3,
};

/**
 * Interface representing the props for the Navigator component.
 * @template T - The type of the payload.
 * @extends SwipeableDrawerProps - Props from SwipeableDrawer component.
 */
interface INavigatorProps<T = Payload> extends SwipeableDrawerProps {
  appName?: string;
  noAppName?: boolean;
  noSearch?: boolean;
  payload?: T;
  activeOptionPath: string;
  options: IScaffold2GroupInternal<T>[];
  BeforeSearch?: React.ComponentType<any>;
  AfterSearch?: React.ComponentType<any>;
  BeforeContent?: React.ComponentType<any>;
  AfterContent?: React.ComponentType<any>;
  onOptionClick?: (path: string, id: string) => void;
  onOptionGroupClick?: (path: string, id: string) => void;
}

/**
 * Represents a Navigator component that displays a permanent drawer with options and content.
 *
 * @template T - The type of payload.
 * @param props - The props for the Navigator component.
 * @param props.sx - The custom styles for the Navigator component.
 * @param props.options - The options to be displayed in the Navigator component.
 * @param props.appName - The name of the application.
 * @param props.noAppName - Whether to hide the application name.
 * @param props.noSearch - Whether to hide the search functionality.
 * @param props.payload - The payload object.
 * @param props.activeOptionPath - The path of the active option.
 * @param props.BeforeSearch - The function to be executed before the search.
 * @param props.AfterSearch - The function to be executed after the search.
 * @param props.BeforeContent - The function to be executed before the content.
 * @param props.AfterContent - The function to be executed after the content.
 * @param props.onOptionClick - The function to be executed when an option is clicked.
 * @param props.onOptionGroupClick - The function to be executed when an option group is clicked.
 * @param otherProps - The additional props.
 * @returns The Navigator component.
 */
export const Navigator = <T extends Payload = Payload>({
  sx,
  options,
  appName,
  noAppName,
  noSearch,
  payload,
  activeOptionPath,
  BeforeSearch,
  AfterSearch,
  BeforeContent,
  AfterContent,
  onOptionClick = () => undefined,
  onOptionGroupClick = () => undefined,
  ...otherProps
}: INavigatorProps<T>) => {
  const {
    isAppleMobile,
  } = useUserAgent();
  const {
    disableBackdropTransition = true,
    disableDiscovery = isAppleMobile,
    disableSwipeToOpen = isAppleMobile,
    swipeAreaWidth = 20,
  } = usePropsContext();
  return (
    <SwipeableDrawer
      variant="permanent"
      disableBackdropTransition={disableBackdropTransition}
      disableSwipeToOpen={disableSwipeToOpen}
      disableDiscovery={disableDiscovery}
      swipeAreaWidth={swipeAreaWidth}
      sx={{
        ...sx,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
      }}
      {...otherProps}
    >
      <Paper
        className={DRAWER_BACKGROUND}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "stretch",
          flexDirection: "column",
        }}
      >
        {BeforeContent && <BeforeContent />}
        <List sx={{ flex: 1 }} disablePadding>
          {!noAppName && (
            <ListItem
              sx={{
                ...itemCategory,
                py: 2,
                fontSize: 22,
                background: "transparent",
              }}
            >
              {appName}
            </ListItem>
          )}
          {BeforeSearch && (
            <ListItem
              sx={{
                background: "transparent",
                boxShadow: (theme: Theme) => {
                  const color = alpha(theme.palette.background.default, 0.1);
                  return `0 -1px 0 ${color} inset`;
                },
              }}
            >
              <BeforeSearch payload={payload} />
            </ListItem>
          )}
          {!noSearch && (
            <ListItem sx={itemCategory}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText>
                <Search />
              </ListItemText>
            </ListItem>
          )}
          {AfterSearch && (
            <ListItem
              sx={{
                background: "transparent",
                boxShadow: (theme: Theme) => {
                  const color = alpha(theme.palette.background.default, 0.1);
                  return `0 -1px 0 ${color} inset`;
                },
              }}
            >
              <AfterSearch payload={payload} />
            </ListItem>
          )}
          {!options.some(({ visible }) => visible) && (
            <ListItem disablePadding sx={{ py: 2, px: 3 }}>
              <ListItemText>Nothing found</ListItemText>
            </ListItem>
          )}
          {options
            .filter(({ visible }) => visible)
            .map(
              (
                {
                  id,
                  path,
                  label,
                  disabled: upperDisabled,
                  noHeader = false,
                  icon: Icon,
                  children,
                },
                idx,
                options
              ) => (
                <Box
                  key={id}
                  sx={{
                    background: "transparent",
                    ...(noHeader && {
                      pt: idx === 0 ? 0 : 2,
                    }),
                  }}
                >
                  {!noHeader && (
                    <ListItem
                      sx={{
                        background: (theme) =>
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.primary.main, 0.023)
                            : undefined,
                        py: 2,
                        px: 3,
                      }}
                    >
                      <ListItemButton
                        onClick={() => onOptionGroupClick(path, id)}
                        disabled={upperDisabled}
                        sx={{
                          pointerEvents: "none",
                          touchAction: "none",
                        }}
                        disableTouchRipple
                        disableRipple
                        disableGutters
                      >
                        {!!Icon && (
                          <ListItemIcon>
                            <Icon />
                          </ListItemIcon>
                        )}
                        <ListItemText>{label || idToLabel(id)}</ListItemText>
                      </ListItemButton>
                    </ListItem>
                  )}
                  {children
                    .filter(({ visible }) => visible)
                    .sort(
                      ({ pin: a = false }, { pin: b = false }) =>
                        Number(b) - Number(a)
                    )
                    .map((option, idx) => (
                      <MenuOption
                        key={`${option.id}-${idx}`}
                        activeOptionPath={activeOptionPath}
                        option={option}
                        onClick={onOptionClick}
                        onGroupClick={onOptionGroupClick}
                      />
                    ))}
                  {idx !== options.length - 1 && (
                    <Divider sx={{ mt: 2, opacity: 0.23 }} />
                  )}
                </Box>
              )
            )}
        </List>
        {AfterContent && <AfterContent />}
      </Paper>
    </SwipeableDrawer>
  );
};

export default Navigator;
