import * as React from "react";
import { useState, useCallback } from "react";

import OutletModal, { IOutletModalProps } from "../components/OutletModal";

import useActualCallback from "../../../hooks/useActualCallback";
import useLocalHistory from "../../../hooks/useLocalHistory";

import IAnything from "../../../model/IAnything";
import { RowId } from "../../../model/IRowData";

interface IParams<
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
> extends Omit<
    IOutletModalProps<Data, Payload, Params>,
    keyof {
      id: never;
      history: never;
      onSubmit: never;
      className: never;
    }
  > {
  onSubmit?: (id: RowId, data: Data | null) => Promise<boolean> | boolean;
  pathname?: string;
}

export const useOutletModal = <
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
>({
  fallback,
  pathname = "/",
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
  const [id, setId] = useState<RowId | null>(null);

  const { history, reload } = useLocalHistory({
    pathname,
  });

  const onSubmit$ = useActualCallback(onSubmit);

  const handleSubmit = useCallback(async (id: RowId, data: Data | null) => {
    const result = await onSubmit$(id, data);
    if (result) {
      setId(null);
    }
    return result;
  }, []);

  const render = useCallback(
    () => (
      <OutletModal
        id={id || ""}
        history={history}
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
      id,
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

  const pickData = useCallback((id: RowId) => {
    reload();
    setId(id);
  }, []);

  return {
    open,
    render,
    pickData,
  };
};

export default useOutletModal;
