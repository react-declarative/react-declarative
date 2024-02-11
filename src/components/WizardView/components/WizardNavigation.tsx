import * as React from "react";
import { SxProps } from "@mui/material";

import { makeStyles } from "../../../styles";

import Box, { BoxProps } from "@mui/material/Box";

import ActionButton, { usePreventAction } from "../../ActionButton";

import classNames from "../../../utils/classNames";

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
