import * as React from "react";
import { useState, useMemo } from "react";

import { alpha, SxProps } from "@mui/material/styles";
import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import UploadIcon from "@mui/icons-material/CloudUpload";

import classNames from "../../utils/classNames";
import randomString from "../../utils/randomString";

/**
 * @interface IDragDropViewProps
 * Represents the props for the DragDropView component.
 */
interface IDragDropViewProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  onData?: (files: File[]) => void;
  onReject?: (files: File[]) => void;
}

/**
 * Represents the state of an input.
 *
 * @interface IState
 */
interface IState {
  inputId: string;
  dragActive: boolean;
}

export const ACCEPT_DEFAULT = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "relative",
    overflow: "hidden",
    width: '100%',
    minHeight: 225,
    border: `1px solid ${alpha(
      theme.palette.getContrastText(theme.palette.background.default),
      0.23
    )}`,
    borderRadius: "4px",
  },
  container: {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    '&:hover': {
      background: alpha(theme.palette.background.paper, 0.2),
    },
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 15,
    padding: theme.spacing(1),
    color: theme.palette.action.active,
  },
  dragZone: {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  hidden: {
    display: 'none',
  },
  icon: {
    fontSize: 48,
  },
  dragActive: {
    background: alpha(theme.palette.background.paper, 0.2),
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
}));

/**
 * Represents a drag and drop view component.
 * @typedef DragDropView
 * @property className - The class name for the component.
 * @property style - The inline style for the component.
 * @property sx - The style object for sx prop.
 * @property disabled - Indicates whether the drag and drop functionality is disabled.
 * @property multiple - Indicates whether multiple files can be selected.
 * @property accept - The file types that are accepted for upload.
 * @property onData - The callback function called when files are dropped or selected.
 * @property onReject - The callback function called when files are rejected.
 */
export const DragDropView = ({
  className,
  style,
  sx,
  disabled = false,
  multiple = false,
  accept = ACCEPT_DEFAULT,
  onData = () => { },
  onReject = () => { },
}: IDragDropViewProps) => {

  const { classes } = useStyles();

  const [state, setState] = useState<IState>({
    inputId: randomString(),
    dragActive: false,
  });

  const setDragActive = (dragActive: boolean) => setState((prevState) => ({ ...prevState, dragActive }));

  const allowedTypes = useMemo(() => new Set(accept.split(", ")), [accept]);
  const acceptAll = useMemo(() => accept === '*', [accept]);

  /**
   * Handles drag events.
   *
   * @param event - The drag event.
   * @returns
   */
  const handleDrag = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) {
      return;
    } else if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Handles the drop event when files are dropped onto the target element.
   *
   * @param event - The drop event object.
   */
  const handleDrop = (event: React.DragEvent) => {
    if (disabled) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const files = Array.from(event.dataTransfer.files || []);
    if (files.length && (files.every((file) => allowedTypes.has(file.type)) || acceptAll)) {
      onData(files);
    } else if (files.length) {
      onReject(files);
    }
  };

  /**
   * Handles change event of an input element.
   *
   * @param event - The change event object.
   * @returns
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.target.files || []);
    if (files.length && (files.every((file) => allowedTypes.has(file.type)) || acceptAll)) {
      onData(files);
    } else if (files.length) {
      onReject(files);
    }
  };

  /**
   * Prevents the default form submission behavior when a form is submitted.
   *
   * @param event - The form submission event object.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <Box
      className={classNames(className, classes.root, {
        [classes.disabled]: disabled,
      })}
      style={style}
      sx={sx}
    >
      <Box
        component="form"
        className={classNames(classes.container, {
          [classes.dragActive]: state.dragActive,
        })}
        onDragEnter={handleDrag}
        onSubmit={handleSubmit}
      >
        <Box component="label" htmlFor={state.inputId} className={classes.content}>
          <Typography variant="h6">
            Drag and drop a file here or click
          </Typography>
          <UploadIcon className={classes.icon} />
        </Box>
      </Box>
      <input
        type="file"
        id={state.inputId}
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className={classes.hidden}
      />
      {state.dragActive && (
        <div
          className={classes.dragZone}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      )}
    </Box>
  );
};

export default DragDropView;
