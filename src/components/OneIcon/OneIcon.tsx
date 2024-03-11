import * as React from "react";
import { useMemo, useState } from "react";

import { makeStyles } from "../../styles";

import One from "../One";

import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Badge from "@mui/material/Badge";

import IOneIconProps from "./model/IOneIconProps";

import useRenderWaiter from "../../hooks/useRenderWaiter";
import useActualValue from "../../hooks/useActualValue";
import useAsyncValue from "../../hooks/useAsyncValue";
import useSingleton from "../../hooks/useSingleton";
import useChange from "../../hooks/useChange";

import getInitialData from "../../utils/getInitialData";
import singlerun from "../../utils/hof/singlerun";
import deepMerge from "../../utils/deepMerge";
import sleep from "../../utils/sleep";

import IAnything from "../../model/IAnything";

const WAIT_FOR_CHANGES_DELAY = 600;

const useStyles = makeStyles()((theme) => ({
  content: {
    minWidth: "300px",
    maxWidth: "80vw",
    maxHeight: "80vh",
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}));

export const OneIcon = <
  Data extends {} = IAnything,
  Payload extends IAnything = IAnything
>({
  waitForChangesDelay = WAIT_FOR_CHANGES_DELAY,
  fieldDebounce,
  noBadge = false,
  fields,
  handler,
  payload: upperPayload = {} as Payload,
  badgeColor = "info",
  color = "default",
  badgeOverlap,
  badgeSx,
  oneSx,
  onChange,
  onFocus,
  onBlur,
  onInvalid,
  ...buttonProps
}: IOneIconProps<Data, Payload>) => {
  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [data, { loading, error }, setData] = useAsyncValue(async () => {
    const getResult = async () => {
      if (typeof handler === "function") {
        return await (handler as Function)(payload);
      }
      return handler;
    };
    const data = deepMerge(
      {},
      getInitialData(fields, payload),
      await getResult()
    );
    onChange && onChange(data, true);
    return data;
  });

  const [invalid, setInvalid] = useState(false);

  const waitForRender = useRenderWaiter([data], 10);

  const data$ = useActualValue(data);

  const waitForChanges = async () => {
    await Promise.race([waitForRender(), sleep(waitForChangesDelay)]);
  };

  useChange(() => {
    if (typeof handler !== "function") {
      setData(handler);
    }
  }, [handler]);

  const filterCount = useMemo(
    () => (noBadge ? 0 : Object.values(data || {}).filter((v) => v).length),
    [data]
  );

  const handleClose = useMemo(
    () =>
      singlerun(async () => {
        await waitForChanges();
        onChange && onChange(data$.current, false);
        setAnchorEl(null);
      }),
    []
  );

  if (loading || error) {
    return null;
  }

  return (
    <>
      <Badge
        badgeContent={filterCount}
        overlap={badgeOverlap}
        color={badgeColor}
        sx={badgeSx}
      >
        <IconButton
          {...buttonProps}
          onClick={({ currentTarget }) => {
            if (!anchorEl) {
              setAnchorEl(currentTarget);
            }
          }}
          color={invalid ? "error" : color}
        />
      </Badge>
      <Popover
        keepMounted
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <One
          className={classes.content}
          sx={oneSx}
          transparentPaper
          fieldDebounce={fieldDebounce}
          fields={fields}
          payload={payload}
          handler={() => data}
          onChange={(data, initial) => {
            if (!initial) {
              setData(data);
              setInvalid(false);
              onChange && onChange(data, false);
            }
          }}
          onInvalid={(name, msg, payload) => {
            setInvalid(true);
            onInvalid && onInvalid(name, msg, payload);
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Popover>
    </>
  );
};

export default OneIcon;
