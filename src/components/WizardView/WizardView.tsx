import * as React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

import { alpha, darken } from "@mui/material";
import { makeStyles } from "../../styles";

import OutletView, { IOutlet } from "../OutletView";
import PaperView from "../PaperView";

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import LinearProgress from "@mui/material/LinearProgress";

import IWizardViewProps from "./model/IWizardViewProps";
import { OtherProps } from "./model/IWizardOutlet";
import IAnything from "../../model/IAnything";

import useActualCallback from "../../hooks/useActualCallback";
import useLocalHistory from "../../hooks/useLocalHistory";
import useElementSize from "../../hooks/useElementSize";
import useSingleton from "../../hooks/useSingleton";

import classNames from "../../utils/classNames";

const HEADER_HEIGHT = 65;
const LOADER_HEIGHT = 4;

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    width: "100%",
    minHeight: 365,
  },
  header: {
    position: "absolute",
    overflowX: "auto",
    top: 0,
    left: 0,
    height: `${HEADER_HEIGHT}px`,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background:
      theme.palette.mode === "dark"
        ? darken(theme.palette.background.paper, 0.06)
        : alpha("#000", 0.05),
    width: "100%",
  },
  loader: {
    position: "absolute",
    top: HEADER_HEIGHT - LOADER_HEIGHT,
    height: "4px",
    zIndex: 2,
    left: 0,
    width: "100%",
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *:nth-of-type(1)": {
      flex: 1,
    },
  },
  adjust: {
    minHeight: HEADER_HEIGHT,
    maxHeight: HEADER_HEIGHT,
  },
}));

/**
 * WizardView component.
 *
 * @template Data - The type of data object passed to the WizardView.
 * @template Payload - The type of payload object passed to the WizardView.
 *
 * @param props - The props object.
 * @param props.className - The class name of the WizardView.
 * @param props.style - The inline styles of the WizardView.
 * @param props.sx - The sx prop for custom styling.
 * @param props.payload - The payload object for the WizardView.
 * @param props.outlinePaper - If true, the PaperView displays an outline.
 * @param props.transparentPaper - If true, the PaperView displays as transparent.
 * @param props.history - The history object for the WizardView.
 * @param props.pathname - The pathname for the WizardView.
 * @param props.steps - The steps array for the WizardView.
 * @param props.routes - The routes array for the WizardView.
 * @param props.onLoadStart - The function to be called when loading starts.
 * @param props.onLoadEnd - The function to be called when loading ends.
 * @param props.otherProps - The other props object for the WizardView.
 * @param outletProps - The outlet props object for the WizardView.
 *
 * @returns The rendered WizardView component.
 */
export const WizardView = <Data extends {} = IAnything, Payload = IAnything, Params = IAnything>({
  className,
  style,
  sx,
  payload: upperPayload = {} as Payload,
  fullScreen,
  outlinePaper = false,
  transparentPaper = false,
  history: upperHistory,
  pathname = "/",
  steps: upperSteps,
  routes,
  onLoadStart,
  onLoadEnd,
  onSubmit = () => true,
  otherProps: upperOtherProps = {} as unknown as OtherProps,
  ...outletProps
}: IWizardViewProps<Data, Payload, Params>) => {
  const { elementRef, size } = useElementSize();

  const payload = useSingleton(upperPayload);

  /**
   * Returns a memoized version of upperSteps filtered by a given predicate.
   *
   * @param payload - The payload to be passed to the isVisible function.
   * @returns - The filtered array of steps.
   */
  const steps = useMemo(
    () => upperSteps.filter(({ isVisible = () => true }) => isVisible(payload)),
    []
  );

  const { classes } = useStyles();

  /**
   * Represents a variable to store and track the history of values.
   * @class
   *
   * @property values - An array to store the history of values.
   *
   * @constructor
   * Creates a new instance of the History variable.
   */
  const { history } = useLocalHistory({
    history: upperHistory,
    pathname,
  });

  const [path, setPath] = useState(history.location.pathname);
  const [loading, setLoading] = useState(0);
  const [progress, setProgress] = useState(0);

  const lastActiveStep = useRef(-1);

  /**
   * Represents additional properties for a component.
   *
   * @typedef OtherProps
   * @property size - The size of the component.
   * @property loading - Indicates if the component is currently loading.
   * @property progress - The progress of the component.
   * @property setLoading - A function to set the loading state of the component.
   * @property setProgress - A function to set the progress of the component.
   */
  const otherProps = useMemo(
    () => {
      return Object.assign(
        {
          size,
          loading: !!loading,
          progress,
          setLoading: (isLoading: boolean) => {
            setLoading((loading) => Math.max(loading + (isLoading ? 1 : -1), 0));
            setProgress(0);
          },
          setProgress: (progress: number) => {
            setLoading(0);
            setProgress(progress);
          },
        },
        upperOtherProps
      );
    },
    [size.height, size.width, loading]
  );

  useEffect(
    () =>
      history.listen(({ location, action }) => {
        if (action === "REPLACE") {
          setPath(location.pathname);
          setLoading(0);
          setProgress(0);
        }
      }),
    []
  );

  /**
   * Returns the active step based on the current route and steps.
   *
   * @returns The active step index. Returns -1 if no active step is found.
   *
   * @param path - The current route path.
   * @param routes - The array of routes.
   * @param steps - The array of steps.
   * @param lastActiveStep - The last active step reference.
   *
   */
  const activeStep = useMemo(() => {
    const route = routes.find(({ isActive }) => isActive(path));
    if (!route) {
      return -1;
    }
    const activeStep = steps.findIndex(
      ({ isMatch = () => false, id }) => id === route.id || isMatch(route.id)
    );
    if (activeStep === -1) {
      return lastActiveStep.current;
    }
    return (lastActiveStep.current = activeStep);
  }, [path]);

  /**
   * Render a loader component based on the state of `loading` and `progress`.
   *
   * @returns The loader component or null.
   */
  const renderLoader = useCallback(() => {
    if (progress === 100) {
      return null;
    }
    if (progress) {
      return (
        <LinearProgress
          className={classes.loader}
          value={progress}
          variant="determinate"
        />
      );
    }
    if (loading) {
      return (
        <LinearProgress className={classes.loader} variant="indeterminate" />
      );
    }
    return null;
  }, [loading, progress]);

  /**
   * Handles form submission asynchronously.
   *
   * @param data - The data to be submitted.
   * @param payload - The payload associated with the submission.
   * @param config - Configuration options for the submission.
   * @param config.afterSave - The function to be executed after the save operation.
   * @returns - Returns false if the submission cannot be made, otherwise returns the result of onSubmit.
   */
  const handleSubmit = useActualCallback(
    async (
      data: Data,
      payload: Payload,
      config: { afterSave: () => Promise<void> }
    ) => {
      if (loading) {
        return false;
      }
      if (progress && progress !== 100) {
        return false;
      }
      return await onSubmit(data, payload, config);
    }
  );

  return (
    <PaperView
      outlinePaper={outlinePaper}
      transparentPaper={transparentPaper}
      className={classNames(classes.root, className)}
      style={style}
      sx={sx}
    >
      <Stepper
        className={classes.header}
        activeStep={activeStep}
        sx={{
          background:
            outlinePaper || transparentPaper
              ? "transparent !important"
              : "inherit",
        }}
      >
        {steps.map(({ label, icon: Icon }, idx) => (
          <Step key={idx} completed={activeStep > idx}>
            <StepLabel StepIconComponent={Icon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {renderLoader()}
      <div className={classes.adjust} />
      <Box ref={elementRef} className={classes.content}>
        <OutletView<Data, Payload>
          history={history}
          fullScreen={fullScreen}
          routes={routes as IOutlet<Data, Payload>[]}
          otherProps={otherProps}
          payload={payload}
          onSubmit={handleSubmit}
          {...outletProps}
        />
      </Box>
    </PaperView>
  );
};

export default WizardView;
