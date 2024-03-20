import * as React from "react";
import { useCallback } from "react";

import { makeStyles } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import copyToClipboard from "../../utils/copyToClipboard";
import classNames from "../../utils/classNames";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

/**
 * Represents an interface for copying properties.
 *
 * @interface
 */
interface ICopyProps extends BoxProps {
  fullWidth?: boolean;
  transparent?: boolean;
  content: string;
  children?: React.ReactNode;
  onCopy?: () => void;
  onCopyClick?: () => void;
  fallback?: (e: Error) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  throwError?: boolean;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  content: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  icon: {
    marginRight: theme.spacing(2),
    overflow: 'hidden',
  },
  stretch: {
    flex: 1,
  },
}));

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
 * Copy Component
 * @param className - Additional class name for the root element.
 * @param content - The text content to be copied.
 * @param fullWidth - If true, the component spans the full width of its container.
 * @param transparent - If true, the button appears without a border.
 * @param children - The content of the component.
 * @param onCopy - Callback function to be called when copying is triggered.
 * @param onCopyClick - Callback function to be called when the copy button is clicked.
 * @param onLoadStart - Callback function to be called when copying starts.
 * @param onLoadEnd - Callback function to be called when copying ends.
 * @param fallback - Callback function to be called when an error occurs during copying.
 * @param throwError - If true, an error during copying will cause an exception to be thrown.
 * @param otherProps - Additional props to be spread to the root element.
 * @returns
 */
export const Copy = ({
  className,
  content,
  fullWidth,
  transparent,
  children = content,
  onCopy = createCopyHandler(content),
  onCopyClick,
  onLoadStart,
  onLoadEnd,
  fallback,
  throwError = false,
  ...otherProps
}: ICopyProps) => {
  const { classes } = useStyles();

  const handleClick = useCallback(
    async (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      let isOk = true;
      onLoadStart && onLoadStart();
      try {
        onCopyClick && onCopyClick();
        await Promise.resolve(onCopy());
      } catch (e: any) {
        isOk = false;
        if (!throwError) {
          fallback && fallback(e as Error);
        } else {
          throw e;
        }
      } finally {
        onLoadEnd && onLoadEnd(isOk);
      }
    },
    [onCopy, onLoadStart, onLoadEnd, fallback, throwError]
  );

  return (
    <Box className={classNames(className, classes.root)} {...otherProps}>
      <Typography className={classes.content} variant="body1">
        {children}
      </Typography>
      {!!fullWidth && <div className={classes.stretch} />}
      <Button
        className={classes.icon}
        variant={transparent ? "text" : "outlined"}
        onClick={handleClick}
        startIcon={<ContentCopyIcon />}
        size="small"
      >
        {!transparent && "Copy"}
      </Button>
      {!fullWidth && <div className={classes.stretch} />}
    </Box>
  );
};

export default Copy;
