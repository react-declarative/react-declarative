import * as React from "react";
import { useState, useCallback } from "react";

import OutletModal, { IOutletModalProps } from "../components/OutletModal";

import useActualCallback from "../../../hooks/useActualCallback";
import useLocalHistory from "../../../hooks/useLocalHistory";

import IAnything from "../../../model/IAnything";
import Id from "../model/Id";

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
  onSubmit?: (id: Id, data: Data | null, payload: Payload) => Promise<boolean> | boolean;
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
  onChange,
  onSubmit = () => true,
  submitLabel,
  title,
  hidden,
  ...outletProps
}: IParams<Data, Payload, Params>) => {
  const [id, setId] = useState<Id | null>(null);

  const { history, reload } = useLocalHistory({
    pathname,
  });

  const onSubmit$ = useActualCallback(onSubmit);

  const handleSubmit = useCallback(async (id: Id, data: Data | null, payload: Payload) => {
    const result = await onSubmit$(id, data, payload);
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

  const pickData = useCallback((id: Id) => {
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
