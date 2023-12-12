import * as React from "react";
import { useRef, useEffect } from "react";

import { useModal } from "../components/ModalProvider";

import IColumn from "../model/IColumn";
import IRowData, { RowId } from "../model/IRowData";
import IAnything from "../model/IAnything";
import IListProps from "../model/IListProps";
import SelectionMode from "../model/SelectionMode";

import ListPicker, { IListPickerProps } from "../components/common/ListPicker";

import useActualCallback from "./useActualCallback";
import useActualState from "./useActualState";

import Subject from "../utils/rx/Subject";

type Fn<Data = IAnything> = (d: Data[] | null) => void;

interface IParams<RowData extends IRowData = IAnything>
  extends Omit<
    IListPickerProps<RowData>,
    keyof {
      onChange: never;
      selectionMode: never;
      selectedRows: never;
      minHeight: never;
      minWidth: never;
      title: never;
      columns: never;
      open: never;
    }
  > {
  selectionMode?: SelectionMode.Single | SelectionMode.Multiple;
  selectedRows?: IListProps<RowData>["selectedRows"];
  columns: Omit<
    IColumn<RowData>,
    keyof {
      headerName: never;
      width: never;
    }
  >[];
  minHeight?: number;
  minWidth?: number;
  title?: string;
}

interface IState {
  open: boolean;
  title: string;
  minWidth: number;
  minHeight: number;
  selectedRows: RowId[] | null;
}

export const useList = <RowData extends IRowData = IAnything>({
  handler,
  columns,
  rowActions,
  payload,
  features,
  selectionMode = SelectionMode.Single,
  title: titleDefault = "Pick item",
  minWidth: minWidthDefault = 425,
  minHeight: minHeightDefault = 375,
  selectedRows: selectedRowsDefault,
}: IParams<RowData>) => {
  const getInitialState = useActualCallback(
    (): IState => ({
      title: titleDefault,
      minWidth: minWidthDefault,
      minHeight: minHeightDefault,
      selectedRows: selectedRowsDefault || null,
      open: false,
    })
  );

  const [state$, setState] = useActualState<IState>(getInitialState);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, title: titleDefault }));
    }
  }, [titleDefault]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, minWidth: minWidthDefault }));
    }
  }, [minWidthDefault]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({ ...prevState, minHeight: minHeightDefault }));
    }
  }, [minHeightDefault]);

  useEffect(() => {
    if (!state$.current.open) {
      setState((prevState) => ({
        ...prevState,
        selectedRows: selectedRowsDefault || null,
      }));
    }
  }, [selectedRowsDefault]);

  const changeRef = useRef<Fn>();

  const handleChange: Fn = (data) => {
    const { current } = changeRef;
    if (current) {
      current(data);
    }
    setState(getInitialState);
    hideModal();
  };

  const { showModal, hideModal } = useModal(
    () => (
      <ListPicker
        open
        payload={payload}
        features={features}
        selectionMode={selectionMode}
        minHeight={state$.current.minHeight}
        minWidth={state$.current.minWidth}
        title={state$.current.title}
        columns={columns}
        handler={handler}
        selectedRows={state$.current.selectedRows}
        onChange={handleChange}
        rowActions={rowActions}
      />
    ),
    []
  );

  return ({
    title,
    minWidth,
    minHeight,
    selectedRows,
  }: Partial<IParams<RowData>> = {}) =>
    new (class {
      constructor() {
        setState((prevState) => ({
          title: title !== undefined ? title : prevState.title,
          minWidth: minWidth !== undefined ? minWidth : prevState.minWidth,
          minHeight: minHeight !== undefined ? minHeight : prevState.minHeight,
          selectedRows:
            selectedRows !== undefined ? selectedRows : prevState.selectedRows,
          open: true,
        }));
        showModal();
      }
      then = (onData: Fn) => {
        changeRef.current = onData;
      };
      toPromise = async () => {
        const subject = new Subject<RowData[] | null>();
        this.then(subject.next);
        return await subject.toPromise();
      };
    })();
};

export default useList;
