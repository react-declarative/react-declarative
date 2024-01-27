import * as React from "react";
import { useCallback } from "react";
import { createMemoryHistory } from "history";

import TabsOutletModal, {
  ITabsModalProps,
} from "../components/TabsOutletModal";

import useBehaviorSubject from "../../../hooks/useBehaviorSubject";
import useActualCallback from "../../../hooks/useActualCallback";
import useSingleton from "../../../hooks/useSingleton";

import IAnything from "../../../model/IAnything";
import History from "../../../model/History";

interface IParams<Data extends {} = Record<string, any>, Payload = IAnything>
  extends Omit<
    ITabsModalProps<Data, Payload>,
    keyof {
      openSubject: never;
      history: never;
      onSubmit: never;
      className: never;
    }
  > {
  onSubmit?: (
    data: Data | null,
    payload: Payload
  ) => Promise<boolean> | boolean;
  fullScreen?: boolean;
  history?: History;
  pathname?: string;
}

export const useTabsModal = <
  Data extends {} = Record<string, any>,
  Payload = IAnything
>({
  fallback,
  pathname = "/",
  history: upperHistory,
  fullScreen = true,
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
  ...outletProps
}: IParams<Data, Payload>) => {

  const openSubject = useBehaviorSubject<boolean>();

  const history = useSingleton(() => upperHistory || createMemoryHistory());

  const onSubmit$ = useActualCallback(onSubmit);

  const handleSubmit = useCallback(
    async (data: Data | null, payload: Payload) => {
      const result = await onSubmit$(data, payload);
      if (result) {
        openSubject.next(false);
      }
      return result;
    },
    []
  );

  const handleClose = useCallback(() => {
    openSubject.next(false);
    onClose && onClose();
  }, []);

  const render = useCallback(
    () => (
      <TabsOutletModal
        openSubject={openSubject}
        fullScreen={fullScreen}
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

  const pickData = useCallback(() => {
    openSubject.next(true);
  }, []);

  return {
    open,
    render,
    pickData,
    close: handleClose,
  } as const;
};

export default useTabsModal;
