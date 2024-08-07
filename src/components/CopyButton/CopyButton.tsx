import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { SxProps } from "@mui/material";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import debounce from "../../utils/hof/debounce";
import copyToClipboard from "../../utils/copyToClipboard";

import ContentCopy from "@mui/icons-material/ContentCopy";

const TOOLTIP_CLOSE_DELAY = 800;

/**
 * Represents the properties for the CopyButton component.
 *
 * @interface ICopyButtonProps
 */
interface ICopyButtonProps {
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  delay?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>, doCopy: () => void) => void;
  onCopy?: (content: string) => void;
  startIcon?: React.ReactNode;
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  content: string | number;
  label?: string | number;
}

/**
 * Creates a copy handler for the given content.
 *
 * @param content - The content to copy.
 * @returns - A Promise that resolves when the content is successfully copied.
 */
const createCopyHandler = (content: React.ReactNode) => async () => {
  let isOk = false;
  isOk = isOk || typeof content === "string";
  isOk = isOk || typeof content === "number";
  isOk = isOk || typeof content === "boolean";
  isOk = isOk || content === undefined;
  isOk = isOk || content === null;
  if (!isOk) {
    return;
  }
  await copyToClipboard(String(content));
};

/**
 * Represents a copy button component.
 *
 * @typedef ICopyButtonProps
 * @property disabled - Determines if the button is disabled.
 * @property className - The class name for the button.
 * @property style - The inline style for the button.
 * @property sx - The custom style for the button using the sx prop from the Material-UI theme.
 * @property onClick - The click event handler for the button.
 * @property delay - The delay before the tooltip closes.
 * @property variant - The variant type of the button.
 * @property size - The size of the button.
 * @property color - The color of the button.
 * @property startIcon - The start icon component of the button.
 * @property content - The content of the button.
 * @property label - The label text of the button.
 */
export const CopyButton = ({
  disabled,
  className,
  style,
  sx,
  onClick,
  content,
  onCopy = createCopyHandler(content),
  delay = TOOLTIP_CLOSE_DELAY,
  variant = "text",
  size = "small",
  color = "info",
  startIcon = <ContentCopy />,
  label = content, 
}: ICopyButtonProps) => {
  const [open, setOpen] = useState(false);

  /**
   * A memoized function that debounces the execution of a given callback function
   * using the provided delay. The debounce function is used to delay the execution
   * of the callback function until after a certain period of time has passed since
   * the last time the debounce function was called.
   *
   * The emitClose variable is defined as a result of calling the useMemo hook,
   * which is a hook used for memoizing the result of a function call. The function
   * being memoized returns a debounced callback function that sets the "open" state
   * to false.
   *
   * @type {Function}
   * @param delay - The number of milliseconds to wait before executing the callback
   * @returns
   */
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
                onCopy(String(content));
                emitClose();
            });
            return;
          }
          setOpen(true);
          onCopy(String(content));
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
