import * as React from "react";
import { useState, useEffect } from "react";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import useSingleton from "../../../hooks/useSingleton";
import useActualState from "../../../hooks/useActualState";

import ActionButton from "../../ActionButton";
import FetchView, { IFetchViewProps } from "../../FetchView";
import LoaderView from "../../LoaderView";
import OutletView from "../OutletView";

import IOutletViewProps from "../model/IOutletViewProps";
import IAnything from "../../../model/IAnything";
import { RowId } from "../../../model/IRowData";
import TSubject from "../../../model/TSubject";

import flatArray from "../../../utils/flatArray";

const Loader = LoaderView.createLoader(24);

export interface IOutletModalProps<
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
> extends Omit<
    IOutletViewProps<Data, Payload, Params>,
    keyof {
      onSubmit: never;
      id: never;
    }
  > {
  id: RowId;
  title?: string;
  fetchState: IFetchViewProps<RowId>["state"];
  reloadSubject?: TSubject<void>;
  onSubmit?: (data: Data | null) => Promise<boolean> | boolean;
  AfterTitle?: React.ComponentType<{
    onClose?: () => void;
    payload: Payload;
    data: Data | null;
  }>;
  data?: Data | null;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
  open?: boolean;
  hidden?: boolean;
  submitLabel?: string;
  mapParams: (id: RowId, data: Record<string, any>[]) => (Params | Promise<Params>);
  mapInitialData: (id: RowId, data: Record<string, any>[]) => (Data | Promise<Data>);
}

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "absolute",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100vw - 50px)",
    height: "calc(100vh - 50px)",
    backgroundColor: theme.palette.background.paper,
    padding: 20,
    overflowY: "auto",
    borderRadius: 5,
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    color: theme.palette.text.primary,
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    maxWidth: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    "& > *": {
      flex: 1,
    },
  },
  submit: {
    paddingTop: 15,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
}));

export const OutletModal = <
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
>({
  hidden = false,
  onSubmit = () => true,
  onChange = () => undefined,
  initialData,
  params,
  mapParams = () => params as Params,
  mapInitialData = () => initialData as Data,
  onLoadStart,
  onLoadEnd,
  fallback,
  reloadSubject,
  id,
  fetchState,
  AfterTitle,
  title,
  data: upperData = null,
  open = true,
  throwError = false,
  submitLabel = "Submit",
  payload: upperPayload = {} as Payload,
  readonly,
  ...outletProps
}: IOutletModalProps<Data, Payload, Params>) => {
  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  const [data, setData] = useState<Data | null>(upperData);
  const [loading, setLoading] = useActualState(0);

  useEffect(() => {
    setData(upperData);
  }, [open]);

  const handleChange = (data: Data, initial: boolean, source: string) => {
    setData(data);
    onChange(data, initial, source);
  };

  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => loading - 1);
    onLoadEnd && onLoadEnd(isOk);
  };

  const handleAccept = async () => {
    if (loading.current) {
      return;
    }
    let isOk = true;
    try {
      handleLoadStart();
      if (open) {
        await onSubmit(data);
      }
    } catch (e: any) {
      isOk = false;
      if (!throwError) {
        fallback && fallback(e as Error);
      } else {
        throw e;
      }
    } finally {
      handleLoadEnd(isOk);
    }
  };

  const handleClose = async () => {
    if (loading.current) {
      return;
    }
    let isOk = true;
    try {
      handleLoadStart();
      if (open) {
        await onSubmit(null);
      }
    } catch (e: any) {
      isOk = false;
      if (!throwError) {
        fallback && fallback(e as Error);
      } else {
        throw e;
      }
    } finally {
      handleLoadEnd(isOk);
    }
  };

  return (
    <Modal
      open={open}
      sx={{
        ...(hidden && {
          visibility: "hidden",
          opacity: 0,
        }),
      }}
      onClose={handleClose}
    >
      <Box className={classes.root}>
        {title && (
          <div className={classes.title}>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            {AfterTitle && (
              <AfterTitle data={data} payload={payload} onClose={handleClose} />
            )}
          </div>
        )}
        <Box className={classes.content}>
          {!!open && (
            <FetchView
              animation="none"
              payload={id}
              state={fetchState}
              reloadSubject={reloadSubject}
              fallback={fallback}
              onLoadStart={onLoadStart}
              onLoadEnd={onLoadEnd}
              Loader={Loader}
              deps={[payload]}
            >
              {async (...args) => (
                <OutletView
                  {...outletProps}
                  fallback={fallback}
                  onLoadStart={onLoadStart}
                  onLoadEnd={onLoadEnd}
                  initialData={await mapInitialData(id, flatArray(args))}
                  params={await mapParams(id, flatArray(args))}
                  readonly={readonly}
                  payload={payload}
                  onChange={handleChange}
                />
              )}
            </FetchView>
          )}
        </Box>
        {!readonly && (
          <ActionButton
            className={classes.submit}
            disabled={!!loading.current || !data}
            size="large"
            variant="contained"
            color="info"
            fullWidth
            onClick={handleAccept}
          >
            {submitLabel}
          </ActionButton>
        )}
      </Box>
    </Modal>
  );
};

export default OutletModal;
