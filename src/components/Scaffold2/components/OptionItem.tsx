import * as React from "react";
import { SxProps } from "@mui/system";

import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import useHoverContext from "../context/HoverContext";

import { IScaffold2OptionInternal } from "../model/IScaffold2Option";

import idToLabel from "../utils/idToLabel";

import OutlinedFlag from "@mui/icons-material/OutlinedFlag";

import { DRAWER_WIDTH } from "../config";
import usePropsContext from "../context/PropsContext";

interface IOptionItemProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  option: IScaffold2OptionInternal;
  activeOptionPath: string;
  currentPadding: number;
  onClick: (path: string, id: string) => void;
}

export const OptionItem = ({
  className,
  style,
  sx,
  option,
  onClick,
  activeOptionPath,
  currentPadding: paddingLeft,
}: IOptionItemProps) => {
  const [, setHoverPath] = useHoverContext();
  const { noOptionHover } = usePropsContext();
  const Icon = option.icon || OutlinedFlag;
  return (
    <ListItem
      className={className}
      onMouseEnter={() => !noOptionHover && setHoverPath(option.path)}
      onMouseLeave={() => !noOptionHover && setHoverPath("")}
      style={style}
      sx={sx}
      disablePadding
    >
      <ListItemButton
        disabled={option.disabled}
        selected={option.path === activeOptionPath}
        onClick={() => onClick(option.path, option.id)}
        sx={{
          overfloxX: 'hidden',
          maxWidth: DRAWER_WIDTH,
          py: "2px",
          px: 3,
          ...sx,
        }}
      >
        <Box style={{ paddingLeft }} />
        {!!Icon && (
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
        )}
        <ListItemText>{option.label || idToLabel(option.id)}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default OptionItem;
