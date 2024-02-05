import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { SxProps } from "@mui/material";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import debounce from "../../utils/hof/debounce";
import copyToClipboard from "../../utils/copyToClipboard";

import { ContentCopy } from "@mui/icons-material";

const TOOLTIP_CLOSE_DELAY = 800;

interface ICopyButtonProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  delay?: number;
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  content: string | number;
}

export const CopyButton = ({
  className,
  style,
  sx,
  delay = TOOLTIP_CLOSE_DELAY,
  variant = "text",
  size = "small",
  content,
}: ICopyButtonProps) => {
  const [open, setOpen] = useState(false);

  const emitClose = useMemo(
    () =>
      debounce(() => {
        setOpen(false);
      }, delay),
    []
  );

  useEffect(() => () => emitClose.clear(), []);

  return (
    <Tooltip
      className={className}
      style={style}
      sx={sx}
      open={open}
      title="Copied!"
      placement="bottom"
      arrow
      disableFocusListener
      disableTouchListener
    >
      <Button
        variant={variant}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
          copyToClipboard(String(content));
          emitClose();
        }}
        startIcon={<ContentCopy />}
        size={size}
      >
        {content}
      </Button>
    </Tooltip>
  );
};

export default CopyButton;
