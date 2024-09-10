import * as React from "react";
import { SxProps } from "@mui/material";

import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import useHoverContext from "../context/HoverContext";

import { IScaffold3OptionInternal } from "../model/IScaffold3Option";

import idToLabel from "../utils/idToLabel";

import OutlinedFlag from "@mui/icons-material/OutlinedFlag";

import { OPENED_WIDTH } from "../config";
import usePropsContext from "../context/PropsContext";
import IconWrapper from "./IconWrapper";

/**
 * Represents the properties for an option item.
 *
 * @interface IOptionItemProps
 */
interface IOptionItemProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  option: IScaffold3OptionInternal;
  activeOptionPath: string;
  currentPadding: number;
  onClick: (path: string, id: string) => void;
}

/**
 * Represents an OptionItem component.
 *
 * @typedef OptionItem
 * @property className - The CSS class name for the component.
 * @property style - The inline styles for the component.
 * @property sx - The system styles for the component.
 * @property option - The data for the option.
 * @property onClick - The function to be called when the option is clicked.
 * @property activeOptionPath - The active path of the option.
 * @property currentPadding - The current padding of the option.
 */
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
          maxWidth: OPENED_WIDTH,
          py: "2px",
          px: 3,
          ...sx,
        }}
      >
        <Box style={{ paddingLeft }} />
        {!!Icon && (
          <ListItemIcon
            sx={{
              '& *': {
                color: option.iconColor,
              },
              color: option.iconColor,
            }}
          >
            <IconWrapper icon={Icon} color={option.iconColor} />
          </ListItemIcon>
        )}
        <ListItemText>{option.label || idToLabel(option.id)}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default OptionItem;
