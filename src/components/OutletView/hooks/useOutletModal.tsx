import * as React from "react";
import { useState, useCallback } from "react";

import OutletModal, { IOutletModalProps } from "../components/OutletModal";

import useActualCallback from "../../../hooks/useActualCallback";

import IAnything from "../../../model/IAnything";

interface IParams<
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
> extends Omit<
    IOutletModalProps<Data, Payload, Params>,
    keyof {
      open: never;
      onSubmit: never;
      className: never;
    }
  > {
  onSubmit?: (data: Data | null) => Promise<boolean> | boolean;
}

export const useOutletModal = <
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
>({
  fallback,
  onLoadEnd,
  onLoadStart,
  throwError,
  payload,
  onChange,
  onSubmit = () => true,
  submitLabel,
  title,
  hidden,
  ...outletProps
}: IParams<Data, Payload, Params>) => {
  const [open, setOpen] = useState(false);

  const onSubmit$ = useActualCallback(onSubmit);

  const handleSubmit = useCallback(async (data: Data | null) => {
    const result = await onSubmit$(data);
    setOpen(!result);
    return result;
  }, []);

  const render = useCallback(
    () => (
      <OutletModal
        open={open}
        hidden={hidden}
        title={title}
        payload={payload}
        fallback={fallback}
        onChange={onChange}
        onLoadEnd={onLoadEnd}
        onLoadStart={onLoadStart}
        submitLabel={submitLabel}
        throwError={throwError}
        onSubmit={handleSubmit}
        {...outletProps}
      />
    ),
    [
      open,
      hidden,
      payload,
      fallback,
      onChange,
      onLoadEnd,
      onLoadStart,
      handleSubmit,
      submitLabel,
      throwError,
      title,
    ]
  );

  const pickData = useCallback(() => {
    setOpen(true);
  }, []);

  return {
    open,
    render,
    pickData,
  };
};

export default useOutletModal;
