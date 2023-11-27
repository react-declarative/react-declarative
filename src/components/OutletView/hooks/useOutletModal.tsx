import * as React from "react";
import { useEffect, useCallback } from "react";
import { createMemoryHistory } from "history";

import OutletModal, { IOutletModalProps } from "../components/OutletModal";

import useBehaviorSubject from "../../../hooks/useBehaviorSubject";
import useActualCallback from "../../../hooks/useActualCallback";
import useSingleton from "../../../hooks/useSingleton";
import useSubject from "../../../hooks/useSubject";

import IAnything from "../../../model/IAnything";
import History from "../../../model/History";
import Id from "../model/Id";
import TSubject from "../../../model/TSubject";

interface IParams<
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
> extends Omit<
    IOutletModalProps<Data, Payload, Params>,
    keyof {
      outletIdSubject: never;
      history: never;
      onSubmit: never;
      className: never;
    }
  > {
  onSubmit?: (id: Id, data: Data | null, payload: Payload) => Promise<boolean> | boolean;
  pickDataSubject?: TSubject<Id>;
  history?: History;
  pathname?: string;
}

export const useOutletModal = <
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
>({
  fallback,
  pathname = "/",
  history: upperHistory,
  onLoadEnd,
  onLoadStart,
  throwError,
  onChange,
  onSubmit = () => true,
  onMount,
  onUnmount,
  onClose,
  submitLabel,
  title,
  hidden,
  pickDataSubject: upperPickDataSubject,
  ...outletProps
}: IParams<Data, Payload, Params>) => {
  const pickDataSubject = useSubject(upperPickDataSubject);
  const outletIdSubject = useBehaviorSubject<Id | null>();

  const history = useSingleton(() => upperHistory || createMemoryHistory());

  const onSubmit$ = useActualCallback(onSubmit);

  const handleSubmit = useCallback(async (id: Id, data: Data | null, payload: Payload) => {
    const result = await onSubmit$(id, data, payload);
    if (result) {
      outletIdSubject.next(null);
    }
    return result;
  }, []);

  const handleClose = useCallback(() => {
    outletIdSubject.next(null);
    onClose && onClose();
  }, []);

  const render = useCallback(
    () => (
      <OutletModal
        outletIdSubject={outletIdSubject}
        history={history}
        hidden={hidden}
        title={title}
        fallback={fallback}
        onChange={onChange}
        onLoadEnd={onLoadEnd}
        onMount={onMount}
        onClose={handleClose}
        onUnmount={onUnmount}
        onLoadStart={onLoadStart}
        submitLabel={submitLabel}
        throwError={throwError}
        onSubmit={handleSubmit}
        {...outletProps}
      />
    ),
    [
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
    outletIdSubject.next(id);
  }, []);

  useEffect(() => pickDataSubject.subscribe(pickData), []);

  return {
    open,
    render,
    pickData,
  };
};

export default useOutletModal;
