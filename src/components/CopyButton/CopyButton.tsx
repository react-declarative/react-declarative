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
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  delay?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>, doCopy: () => void) => void;
  startIcon?: React.ReactNode;
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  content: string | number;
  label?: string | number;
}

export const CopyButton = ({
  disabled,
  className,
  style,
  sx,
  onClick,
  delay = TOOLTIP_CLOSE_DELAY,
  variant = "text",
  size = "small",
  color = "info",
  startIcon = <ContentCopy />,
  content,
  label = content, 
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
        disabled={disabled}
        variant={variant}
        color={color}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onClick) {
            onClick(e, () => {
                setOpen(true);
                copyToClipboard(String(content));
                emitClose();
            });
            return;
          }
          setOpen(true);
          copyToClipboard(String(content));
          emitClose();
        }}
        startIcon={startIcon}
        size={size}
      >
        {label}
      </Button>
    </Tooltip>
  );
};

export default CopyButton;
