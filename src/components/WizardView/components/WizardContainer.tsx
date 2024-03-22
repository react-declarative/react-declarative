import * as React from "react";
import { forwardRef } from "react";
import { SxProps } from "@mui/material";

import { makeStyles } from "../../../styles";

import Box, { BoxProps } from "@mui/material/Box";

import classNames from "../../../utils/classNames";

/**
 * Represents the props for the WizardContainer component.
 */
interface IWizardContainerProps extends BoxProps {
  ref?: React.Ref<HTMLDivElement | undefined>;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  Navigation?: React.ReactNode;
}

const useStyles = makeStyles()({
  root: {
    display: "flex",
    height: "100%",
    width: "100%",
    justifyContent: "stretch",
    alignItems: "stretch",
    flexDirection: "column",
  },
  container: {
    flex: 1,
  },
});

/**
 * Represents an internal component for the WizardContainer.
 *
 * @param IWizardContainerProps - The props for the WizardContainer.
 * @param IWizardContainerProps.className - The class name for the component.
 * @param IWizardContainerProps.Navigation - The navigation component for the wizard.
 * @param IWizardContainerProps.children - The children components of the WizardContainer.
 * @param ...otherProps - Additional props for the Box component.
 * @param ref - Reference to the HTMLDivElement or undefined.
 *
 * @returns The rendered WizardContainerInternal component.
 */
const WizardContainerInternal = (
  { className, Navigation, children, ...otherProps }: IWizardContainerProps,
  ref: React.Ref<HTMLDivElement | undefined>
) => {
  const { classes } = useStyles();
  return (
    <Box
      ref={ref}
      className={classNames(className, classes.root)}
      {...otherProps}
    >
      <div className={classes.container}>{children}</div>
      {Navigation}
    </Box>
  );
};

/**
 * WizardContainer
 *
 * A container component that wraps the WizardContainerInternal component.
 * It is a functional component of type React.FC, which takes an IWizardContainerProps as its props.
 * It is created using `forwardRef` to allow obtaining a reference to the rendered DOM element for external usage.
 *
 * @component
 * @param {React.ForwardedRef<unknown>} ref - A forwarded reference to the underlying WizardContainerInternal component.
 * @param {IWizardContainerProps} props - The props for the WizardContainer component.
 * @returns {React.ReactElement} The rendered WizardContainer component.
 */
export const WizardContainer = forwardRef(
  WizardContainerInternal
) as unknown as React.FC<IWizardContainerProps>;

export default WizardContainer;
