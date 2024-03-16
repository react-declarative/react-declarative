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

import idToLabel from "../utils/idToLabel";

import MenuOption from "./MenuOption";
import Search from "./Search";

export const DRAWER_BACKGROUND = "react-declarative__scaffold2Background";

const itemCategory = {
  boxShadow: (theme: Theme) => {
    const color = alpha(theme.palette.background.default, 0.1);
    return `0 -1px 0 ${color} inset`;
  },
  py: 1.5,
  px: 3,
};

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
    disableBackdropTransition = true,
    disableDiscovery = false,
    swipeAreaWidth = 65,
  } = usePropsContext();
  return (
    <SwipeableDrawer
      variant="permanent"
      disableBackdropTransition={disableBackdropTransition}
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
