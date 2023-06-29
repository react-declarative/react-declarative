import * as React from "react";
import { useState, useCallback, useEffect } from "react";

import SearchModal, { ISearchModalProps } from "./SearchModal";

import useActualCallback from "../../hooks/useActualCallback";
import useActualValue from "../../hooks/useActualValue";

import TypedField from "../../model/TypedField";
import IAnything from "../../model/IAnything";
import IField from "../../model/IField";
import IRowData from "../../model/IRowData";

type Param = IRowData['id'][];

interface IParams<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>,
>
  extends Omit<
    ISearchModalProps<FilterData, RowData, Payload, Field>,
    keyof {
      open: never;
      onSubmit: never;
      className: never;
      isChooser: never;
      style: never;
    }
  > {
    param?: Param;
    onSubmit?: (data: IRowData['id'][] | null, param: Param) => Promise<boolean> | boolean;
  }

export const useSearchModal = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>,
>({
  param: upperParam,
  handler,
  fallback,
  apiRef,
  reloadSubject,
  payload,
  onChange,
  onAction,
  onRowAction,
  onRowClick,
  onSubmit = () => true,
  onLoadEnd,
  onLoadStart,
  submitLabel,
  throwError,
  title,
  ...listProps
}: IParams<FilterData, RowData, Payload, Field>) => {
  const [open, setOpen] = useState(false);
  const [param, setParam] = useState<Param>(upperParam || []);

  useEffect(() => {
    setParam(upperParam as never);
  }, [upperParam]);

  const onSubmit$ = useActualCallback(onSubmit);
  const param$ = useActualValue(param);

  const handleSubmit = useCallback(async (data: IRowData['id'][] | null) => {
    const result = await onSubmit$(data?.length ? data : null, param$.current);
    setOpen(!result);
    return result;
  }, []);

  const render = useCallback(
    () => (
      <SearchModal
        open={open}
        data={param}
        title={title}
        apiRef={apiRef}
        reloadSubject={reloadSubject}
        handler={handler}
        payload={payload}
        fallback={fallback}
        onChange={onChange}
        onLoadEnd={onLoadEnd}
        onLoadStart={onLoadStart}
        onAction={onAction}
        onRowAction={onRowAction}
        onRowClick={onRowClick}
        submitLabel={submitLabel}
        throwError={throwError}
        onSubmit={handleSubmit}
        {...listProps}
      />
    ),
    [
      open,
      apiRef,
      reloadSubject,
      handler,
      payload,
      fallback,
      onChange,
      onLoadEnd,
      onLoadStart,
      handleSubmit,
      submitLabel,
      throwError,
      title,
      param,
    ]
  );

  const pickData = useCallback((param: Param = []) => {
    setParam(param);
    setOpen(true);
  }, []);

  return {
    render,
    pickData,
  };
};

export const useSearchModalTyped = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = TypedField<FilterData, Payload>
>(params: IParams<FilterData, RowData, Payload, Field>) =>
  useSearchModal(params);

export default useSearchModal;
