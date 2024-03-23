import * as React from 'react';

import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import CloudSync from "@mui/icons-material/CloudSync";

/**
 * Represents the props for the DownloadButton component.
 * @interface IDownloadButtonProps
 */
interface IDownloadButtonProps {
  primary: string;
  secondary: string;
}

/**
 * Represents a download button component.
 * @param props - The props for the DownloadButton component.
 * @param props.primary - The primary text to be displayed in the button.
 * @param props.secondary - The secondary text to be displayed in the button.
 * @returns - The DownloadButton component.
 */
export const DownloadButton = ({
  primary,
  secondary,
}: IDownloadButtonProps) => (
  <ListItem sx={{ ml: -1 }}>
    <ListItemAvatar>
      <Avatar>
        <CloudSync />
      </Avatar>
    </ListItemAvatar>
    <ListItemText primary={primary} secondary={secondary} />
  </ListItem>
);

export default DownloadButton;
