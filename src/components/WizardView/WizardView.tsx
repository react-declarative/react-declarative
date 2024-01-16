import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

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

import useLocalHistory from "../../hooks/useLocalHistory";
import useElementSize from "../../hooks/useElementSize";

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
    height: HEADER_HEIGHT,
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

export const WizardView = <Data extends {} = IAnything, Payload = IAnything>({
  className,
  style,
  sx,
  outlinePaper = false,
  history: upperHistory,
  pathname = "/",
  steps,
  routes,
  onLoadStart,
  onLoadEnd,
  ...outletProps
}: IWizardViewProps<Data, Payload>) => {
  const { elementRef, size } = useElementSize();

  const { classes } = useStyles();

  const { history } = useLocalHistory({
    history: upperHistory,
    pathname,
  });

  const [path, setPath] = useState(history.location.pathname);
  const [loading, setLoading] = useState(0);

  const lastActiveStep = useRef(-1);

  const otherProps = useMemo(
    (): OtherProps => ({
      size,
      loading: !!loading,
      setLoading: (isLoading) =>
        setLoading((loading) => loading + (isLoading ? 1 : -1)),
    }),
    [size.height, size.width, loading]
  );

  useEffect(
    () =>
      history.listen(({ location, action }) => {
        if (action === "REPLACE") {
          setPath(location.pathname);
        }
      }),
    []
  );

  const activeStep = useMemo(() => {
    const route = routes.find(({ isActive }) => isActive(path));
    if (!route) {
      return -1;
    }
    const activeStep = steps.findIndex(({ id }) => id === route.id);
    if (activeStep === -1) {
      return lastActiveStep.current;
    }
    return (lastActiveStep.current = activeStep);
  }, [path]);

  return (
    <PaperView
      outlinePaper={outlinePaper}
      className={classNames(classes.root, className)}
      style={style}
      sx={sx}
    >
      <Stepper
        className={classes.header}
        activeStep={activeStep}
        sx={{ background: outlinePaper ? "transparent !important" : "inherit" }}
      >
        {steps.map(({ label, icon: Icon }, idx) => (
          <Step key={idx} completed={activeStep > idx}>
            <StepLabel StepIconComponent={Icon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {!!loading && <LinearProgress className={classes.loader} />}
      <div className={classes.adjust} />
      <Box ref={elementRef} className={classes.content}>
        <OutletView<Data, Payload>
          history={history}
          routes={routes as IOutlet<Data, Payload>[]}
          otherProps={otherProps}
          {...outletProps}
        />
      </Box>
    </PaperView>
  );
};

export default WizardView;
