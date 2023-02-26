import * as React from "react";
import { Theme, alpha, darken } from "@mui/material";

import Divider from "@mui/material/Divider";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
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

import idToLabel from "../utils/idToLabel";

import MenuOption from "./MenuOption";
import Search from "./Search";

const itemCategory = {
  boxShadow: (theme: Theme) => {
    const color = alpha(theme.palette.background.default, 0.1);
    return `0 -1px 0 ${color} inset`;
  },
  py: 1.5,
  px: 3,
};

interface INavigatorProps<T = Payload> extends DrawerProps {
  appName?: string;
  payload?: T;
  options: IScaffold2GroupInternal<T>[];
  BeforeSearch?: React.ComponentType<any>;
  AfterSearch?: React.ComponentType<any>;
  onOptionClick?: (name: string) => void;
  onOptionGroupClick?: (name: string) => void;
}

export const Navigator = <T extends Payload = Payload>({
  sx,
  options,
  appName,
  payload,
  BeforeSearch,
  AfterSearch,
  onOptionClick = () => undefined,
  onOptionGroupClick = () => undefined,
  ...otherProps
}: INavigatorProps<T>) => (
  <Drawer
    variant="permanent"
    sx={{
      ...sx,
      display: "flex",
      alignItems: "stretch",
      justifyContent: "stretch",
    }}
    {...otherProps}
  >
    <Paper
      sx={{
        flex: 1,
        bgColor: (theme: Theme) => darken(theme.palette.background.paper, 0.06)
      }}
    >
      <List disablePadding>
        <ListItem
          sx={{
            ...itemCategory,
            py: 2,
            fontSize: 22,
            bgcolor: (theme: Theme) => theme.palette.background.paper,
          }}
        >
          {appName}
        </ListItem>
        {BeforeSearch && (
          <ListItem>
            <BeforeSearch payload={payload} />
          </ListItem>
        )}
        <ListItem sx={itemCategory}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText>
            <Search />
          </ListItemText>
        </ListItem>
        {AfterSearch && (
          <ListItem>
            <AfterSearch payload={payload} />
          </ListItem>
        )}
        {!options.some(({ visible }) => visible) && (
          <ListItem
            disablePadding
            sx={{ py: 2, px: 3 }}
          >
            <ListItemText>
              Nothing found
            </ListItemText>
          </ListItem>
        )}
        {options
          .filter(({ visible }) => visible)
          .map(
            ({ id, label, disabled: upperDisabled, icon: Icon, children }) => (
              <Box
                key={id}
                sx={{
                  bgcolor: (theme: Theme) => theme.palette.background.paper,
                }}
              >
                <ListItem sx={{ py: 2, px: 3 }}>
                  <ListItemButton
                    onClick={() => onOptionGroupClick(id)}
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
                {children
                  .filter(({ visible }) => visible)
                  .map((option, idx) => (
                    <MenuOption
                      key={`${option.id}-${idx}`}
                      option={option}
                      onClick={onOptionClick}
                    />
                  )
                )}
                <Divider sx={{ mt: 2 }} />
              </Box>
            )
          )}
      </List>
    </Paper>
  </Drawer>
);

export default Navigator;
