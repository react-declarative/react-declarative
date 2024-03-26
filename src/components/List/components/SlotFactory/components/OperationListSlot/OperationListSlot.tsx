import * as React from "react";
import { useState } from "react";

import { makeStyles } from "../../../../../../styles";
import { alpha } from "@mui/material";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";

import Async from "../../../../../Async";
import ScrollView from "../../../../../ScrollView";

import useActualCallback from "../../../../../../hooks/useActualCallback";

import useCachedRows from "../../../../hooks/useCachedRows";
import usePayload from "../../../../hooks/usePayload";
import useReload from "../../../../hooks/useReload";
import useProps from "../../../../hooks/useProps";

import { IOperationListSlot } from "../../../../slots/OperationListSlot";

import classNames from "../../../../../../utils/classNames";

const LOAD_SOURCE = "list-operations";
const LABEL_SHRINK = 500;

/**
 * A function that generates styles for a component based on the provided theme.
 *
 * @typedef {Object} Styles
 * @property {string} root - Styles for the root element.
 * @property {string} container - Styles for the container element.
 * @property {string} content - Styles for the content element.
 * @property {string} label - Styles for the label element.
 * @property {string} checkbox - Styles for the checkbox element.
 */
const useStyles = makeStyles()((theme) => ({
  root: {
    height: 50,
    width: "100%",
    background: alpha(
      theme.palette.getContrastText(theme.palette.background.paper),
      0.05
    ),
  },
  container: {
    minWidth: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    "& > *": {
      marginRight: "5px !important",
      whiteSpace: "nowrap",
    },
  },
  label: {
    display: "flex",
    whiteSpace: "nowrap",
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
  },
}));

/**
 * Renders a component that displays a list of operations.
 *
 * @param props - The component props.
 * @param props.className - The class name for the root element.
 * @param props.style - The inline style for the root element.
 * @param props.operations - The list of operations to display.
 * @param props.width - The width of the component.
 * @returns The rendered component.
 */
export const OperationListSlot = ({
  className,
  style,
  operations,
  width,
}: IOperationListSlot) => {
  const { classes } = useStyles();

  const payload = usePayload();

  const {
    onOperation = () => null,
    fallback,
    onLoadStart,
    onLoadEnd,
    loading,
    withAllListOperations,
  } = useProps();

  const reload = useReload();

  const [isAll, setIsAll] = useState(false);

  const { selectedRows } = useCachedRows();

  const conditionPayload = isAll ? "all" : selectedRows;

  /**
   * Invokes the `useActualCallback` function with the `onOperation` callback function
   * to handle a specific operation.
   *
   * @param {function} onOperation - The callback function to execute for the operation.
   */
  const handleOperation = useActualCallback(onOperation);

  /**
   * Creates a handle operation click function.
   *
   * @param action - The action to perform.
   * @returns - The function that handles the operation click.
   */
  const createHandleOperationClick = (action: string) => () => {
    handleOperation(action, selectedRows, isAll, reload);
  };

  /**
   * Represents a checkbox component that can be used to toggle the selection of all items.
   *
   * @class
   * @component
   */
  const AllCheckbox = (
    <Checkbox
      disabled={loading}
      value={isAll}
      onChange={() => setIsAll(!isAll)}
    />
  );

  const nothingFound = !selectedRows.length && !isAll;

  /**
   * Represents a loader component.
   * @constructor
   */
  const Loader = () => (
    <>
      {operations.map(({ label, icon: Icon }, idx) => (
        <Button
          disabled
          key={idx}
          size="small"
          variant="contained"
          startIcon={Icon && <Icon />}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box display="flex" alignItems="center">
              <CircularProgress size="16px" color="inherit" />
            </Box>
            <Box>{label}</Box>
          </Stack>
        </Button>
      ))}
    </>
  );

  /**
   * Executes the `onLoadStart` callback function if provided.
   *
   * @function handleLoadStart
   * @returns
   */
  const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
  /**
   * Handles the onLoadEnd event.
   *
   * @param isOk - Indicates whether the load operation is successful or not.
   * @returns
   */
  const handleLoadEnd = (isOk: boolean) =>
    onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

  /**
   * Executable operation component that represents a clickable button.
   *
   * @param props - The properties for the Operation component.
   * @param props.available - Indicates if the operation is available for interaction.
   * @param props.onClick - The function to be executed when the button is clicked.
   * @param props.label - The label to be displayed on the button.
   * @param [props.icon] - The optional icon component to be displayed on the button.
   */
  const Operation = ({
    available,
    onClick,
    label,
    icon: Icon,
  }: {
    available: boolean;
    onClick: () => void;
    label: string;
    icon?: React.ComponentType<any>;
  }) => {
    const { loading } = useProps();
    return (
      <Button
        disabled={loading || !available}
        size="small"
        variant="contained"
        onClick={onClick}
        startIcon={Icon && <Icon />}
      >
        {label}
      </Button>
    );
  };

  return (
    <ScrollView className={classes.root} hideOverflowY>
      <Box className={classNames(className, classes.container)} style={style}>
        <Box className={classes.content}>
          <Async
            payload={conditionPayload}
            deps={[payload]}
            Loader={Loader}
            fallback={fallback}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            throwError
          >
            {async () => {
              return await Promise.all(
                operations.map(
                  async ({ action = "unknown-action", label = "Unknown", icon, isAvailable = true }, idx) => {
                    const handleAvailable = () =>
                      typeof isAvailable === "function"
                        ? isAvailable(selectedRows, isAll, payload)
                        : isAvailable;
                    const available = nothingFound
                      ? false
                      : await handleAvailable();
                    return (
                      <Operation
                        key={idx}
                        available={available}
                        label={label}
                        icon={icon}
                        onClick={createHandleOperationClick(action)}
                      />
                    );
                  }
                )
              );
            }}
          </Async>
        </Box>
        {withAllListOperations && (
          <Box className={classes.label}>
            {width < LABEL_SHRINK ? (
              AllCheckbox
            ) : (
              <FormControlLabel
                disabled={loading}
                control={AllCheckbox}
                label="All items"
              />
            )}
          </Box>
        )}
      </Box>
    </ScrollView>
  );
};

export default OperationListSlot;
