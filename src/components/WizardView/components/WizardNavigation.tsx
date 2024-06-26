import * as React from "react";
import { SxProps } from "@mui/material";

import { makeStyles } from "../../../styles";

import Box, { BoxProps } from "@mui/material/Box";

import ActionButton, { usePreventAction } from "../../ActionButton";

import classNames from "../../../utils/classNames";

/**
 * Interface for the properties of the Wizard Navigation component.
 */
interface IWizardNavigationProps extends BoxProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  disabled?: boolean;
  AfterPrev?: React.ComponentType<any>;
  BeforeNext?: React.ComponentType<any>;
  fallback?: (e: Error) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  labelPrev?: string;
  labelNext?: string;
  onPrev?: () => (void | Promise<void>);
  onNext?: () => (void | Promise<void>);
  throwError?: boolean;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    justifyContent: "stretch",
    alignItems: 'center',
    flexDirection: "row",
    padding: theme.spacing(1),
    gap: theme.spacing(1),
  },
  stretch: {
    flex: 1,
  },
}));

/**
 * Represents a component for navigating through a wizard.
 * @typedef WizardNavigation
 * @property className - The CSS class name for the component.
 * @property style - The inline style object for the component.
 * @property sx - The sx prop for the component.
 * @property disabled - Whether the component is disabled or not.
 * @property fallback - The fallback prop for the component.
 * @property onLoadStart - The onLoadStart prop for the component.
 * @property onLoadEnd - The onLoadEnd prop for the component.
 * @property onPrev - The onPrev prop for the component.
 * @property onNext - The onNext prop for the component.
 * @property AfterPrev - The AfterPrev prop for the component.
 * @property BeforeNext - The BeforeNext prop for the component.
 * @property hasPrev - Whether the component has a previous step or not.
 * @property hasNext - Whether the component has a next step or not.
 * @property labelPrev - The label for the previous button.
 * @property labelNext - The label for the next button.
 * @property throwError - Whether an error should be thrown or not.
 * @property - The additional props for the component.
 * @returns The rendered component.
 */
export const WizardNavigation = ({
  className,
  style,
  sx,
  disabled,
  fallback,
  onLoadStart,
  onLoadEnd,
  onPrev,
  onNext,
  AfterPrev,
  BeforeNext,
  hasPrev = false,
  hasNext = false,
  labelPrev = "Prev",
  labelNext = "Next",
  throwError,
  ...otherProps
}: IWizardNavigationProps) => {
  const { classes } = useStyles();

  const {
    handleLoadStart,
    handleLoadEnd,
    loading,
  } = usePreventAction({
    onLoadStart,
    onLoadEnd,
    disabled,
  });

  return (
    <Box
      className={classNames(className, classes.root)}
      style={style}
      sx={sx}
      {...otherProps}
    >
      <ActionButton
        disabled={loading || !hasPrev}
        onClick={onPrev}
        variant="contained"
        fallback={fallback}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        throwError={throwError}
      >
        {labelPrev}
      </ActionButton>
      {AfterPrev && <AfterPrev />}
      <div className={classes.stretch} />
      {BeforeNext && <BeforeNext />}
      <ActionButton
        disabled={loading || !hasNext}
        onClick={onNext}
        variant="contained"
        fallback={fallback}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        throwError={throwError}
      >
        {labelNext}
      </ActionButton>
    </Box>
  );
};

export default WizardNavigation;
