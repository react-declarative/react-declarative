import * as React from 'react';
import { useMemo, useState } from 'react';

import { makeStyles } from '../../styles';

import One from '../One';

import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';

import IOneButtonProps from './model/IOneButtonProps';

import useRenderWaiter from '../../hooks/useRenderWaiter';
import useActualValue from '../../hooks/useActualValue';
import useAsyncValue from '../../hooks/useAsyncValue';
import useSingleton from '../../hooks/useSingleton';
import useChange from '../../hooks/useChange';

import getInitialData from '../../utils/getInitialData';
import singlerun from '../../utils/hof/singlerun';
import deepMerge from '../../utils/deepMerge';
import sleep from '../../utils/sleep';

import IAnything from '../../model/IAnything';

const WAIT_FOR_CHANGES_DELAY = 600;

const useStyles = makeStyles()((theme) => ({
  root: { 
    minWidth: "300px",
    maxHeight: "80vh",
    overflowY: "auto"
  },
  content: {
    margin: theme.spacing(1),
  },
}));

export const OneButton = <Data extends {} = IAnything, Payload extends IAnything = IAnything>({
  waitForChangesDelay = WAIT_FOR_CHANGES_DELAY,
  noBadge = false,
  fields,
  handler,
  payload: upperPayload = {} as Payload,
  badgeColor = 'info',
  color = 'primary',
  badgeOverlap,
  badgeSx,
  onChange,
  onInvalid,
  ...buttonProps
}: IOneButtonProps<Data, Payload>) => {

  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [data, { loading, error }, setData] = useAsyncValue(async () => {
    const getResult = async () => {
      if (typeof handler === 'function') {
        return await (handler as Function)(payload);
      }
      return handler;
    };
    const data = deepMerge({}, getInitialData(fields, payload), await getResult());
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
    if (typeof handler !== 'function') {
      setData(handler);
    }
  }, [handler]);

  const filterCount = useMemo(
    () => noBadge ? 0 : Object.values(data || {}).filter((v) => v).length,
    [data],
  );

  const handleClose = useMemo(() => singlerun(async () => {
    await waitForChanges();
    onChange && onChange(data$.current, false);
    setAnchorEl(null);
  }), []);

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
        <Button
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
        <div className={classes.root}>
          <One
            className={classes.content}
            transparentPaper
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
          />
        </div>
      </Popover>
    </>
  );
};

export default OneButton;
